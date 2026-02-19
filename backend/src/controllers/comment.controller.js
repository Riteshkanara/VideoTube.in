import { mongoose, isValidObjectId } from "mongoose"
import { Comment } from "../models/comment.model.js"
import { Video } from "../models/video.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const pageNum = Math.max(parseInt(page) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit) || 10, 1), 100);
    const skip = (pageNum - 1) * limitNum;
    
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid videoId");
    }
    
    const userId = req.user?._id; 
    
    const comments = await Comment.aggregate([
        {
            $match: {
                video: new mongoose.Types.ObjectId(videoId)
            }
        },
        // 1. Correctly Lookup the Owner
        {
            $lookup: {
                from: "users",
                localField: "owner", // Matches the owner ID in the Comment
                foreignField: "_id", // Matches the _id in the Users collection
                as: "owner", // Put the result directly into the "owner" array
                pipeline: [
                    {
                        // Explicitly project the fields your CommentCard needs
                        $project: { username: 1, avatar: 1, fullName: 1, _id: 1 } 
                    }
                ]
            }
        },
        // 2. Lookup Likes
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "comment",
                as: "likesData"
            }
        },
        // 3. Add Fields and Flatten the Arrays
        {
            $addFields: {
                // ⚠️ CRITICAL: Flatten the "owner" array into a single object!
                // Without $first, comment.owner is an array, and comment.owner.avatar is undefined!
                owner: { $first: "$owner" }, 
                likesCount: { $size: "$likesData" },
                isLiked: {
                    $cond: {
                        if: { $in: [userId, "$likesData.likedBy"] },
                        then: true,
                        else: false
                    }
                }
            }
        },
        // 4. Clean up
        {
            $project: {
                likesData: 0 
            }
        },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limitNum }
    ]);

    const totalComments = await Comment.countDocuments({ video: videoId });
    const totalPages = Math.ceil(totalComments / limitNum);

    res.status(200).json(new ApiResponse(200, {
        comments: comments, 
        pagination: {
            totalItems: totalComments,
            totalPages: totalPages
        }
    }, "Comments fetched successfully"));
});

const addComment = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { content } = req.body;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid videoId");
    }

    if (!content?.trim()) {
        throw new ApiError(400, "Comment text is required");
    }

    const videoExists = await Video.exists({ _id: videoId }); 
    if (!videoExists) {
        throw new ApiError(404, "Video not found");
    }

    const comment = await Comment.create({
        content: content,
        video: videoId,
        owner: req.user?._id
    });

    if (!comment) {
        throw new ApiError(500, "Failed to add comment");
    }

    // Optional but recommended: Populate the owner so the new comment displays correctly
    const populatedComment = await Comment.findById(comment._id).populate("owner", "username avatar fullName");

    const formattedComment = populatedComment.toObject();

    formattedComment.ownerDetails = formattedComment.owner;
    formattedComment.likesCount = 0;
    formattedComment.isLiked = false;

    return res
        .status(201)
        .json(new ApiResponse(201, populatedComment, "Comment added successfully"));
});

const updateComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid commentId");
    }
    
    if (!content || content.trim().length === 0) {
        throw new ApiError(400, "Comment text is required");
    }
    
    const comment = await Comment.findById(commentId);
    
    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }
    
    if (comment.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this comment");
    }
    
    // FIX: Changed 'text' to 'content' to match the req.body variable
    comment.content = content; 
    await comment.save();

    return res.status(200).json(
        new ApiResponse(200, comment, "Comment updated successfully")
    );
});

const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid commentId");
    }
    
    const comment = await Comment.findById(commentId);
    
    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }
    
    if (comment.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this comment");
    }
    
    await Comment.findByIdAndDelete(commentId);

    return res.status(200).json(
        new ApiResponse(200, null, "Comment deleted successfully")
    );
});

export {
    getVideoComments, 
    addComment, 
    updateComment,
    deleteComment
}