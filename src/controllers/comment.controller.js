import {mongoose,isValidObjectId } from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

    
    const pageNum = Math.max (parseInt (page) || 1, 1)
    const limitNum = Math.min (Math.max (parseInt (limit) || 10, 1), 100)
    const skip = (pageNum - 1) * limitNum
    
    if(!isValidObjectId(videoId)){
        throw new ApiError (400, "Invalid videoId")
    }
    
    const Comments = await Comment.aggregate ([
        {
            $match: {
                video: new mongoose.Types.ObjectId (videoId)
            }
        },
        {
            $lookup:{
                from:"users",
                localField:"owner",
                foreignField:"_id",
                as:"ownerDetails",
                pipeline:[
                    {
                        $project:{ username:1, avatar:1, fullName:1}
                    }
                ]

            }
        },
        {
            $addFields:{
                ownerDetails: 
                    { $first: "$ownerDetails" }
            }
        },
        {
            $sort: {createdAt: -1}
        },
        {
            $skip: skip
        },
        {
            $limit: limitNum
        },

    ])

    const totalComments = await Comment.countDocuments ({video: videoId})
    const totalPages = Math.ceil (totalComments / limitNum)

    res.status (200).json (new ApiResponse (200, {
        comments: Comments,
        pagination: {
            totalItems: totalComments,
            totalPages: totalPages,}
        }))
    


})


const addComment = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const { text } = req.body

    // 1. Validation: Check ID validity and text content in one go
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid videoId")
    }

    if (!text?.trim()) {
        throw new ApiError(400, "Comment text is required")
    }

    // 2. Optimization: Check if the VIDEO exists (not the comment)
    // We use .exists() instead of findById if we only care if it's there (faster)
    const videoExists = await Video.findById(videoId); 
    if (!videoExists) {
        throw new ApiError(404, "Video not found")
    }

    // 3. Create the comment
    const comment = await Comment.create({
        content: text, // Make sure your model field is 'text' or 'content'
        video: videoId,
        owner: req.user?._id
    })

    if (!comment) {
        throw new ApiError(500, "Failed to add comment")
    }

    // 4. Send Response
    return res
        .status(201)
        .json(new ApiResponse(201, comment, "Comment added successfully"))
})







const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const { commentId } = req.params
    const { text } = req.body

    if(!isValidObjectId(commentId)){
        throw new ApiError(400, "Invalid commentId")
    }
    if(!text || text.trim().length === 0){
        throw new ApiError(400, "Comment text is required")
    }
    const comment = await Comment.findById(commentId)
    if(!comment){
        throw new ApiError(404, "Comment not found")
    }
    if(comment.owner.toString() !== req.user?._id.toString()){
        throw new ApiError(403, "You are not authorized to update this comment")
    }
    comment.content = text
    await comment.save()

    return res.status(200).json(
        new ApiResponse(200, comment, "Comment updated successfully")
    )
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const { commentId } = req.params  

    if(!isValidObjectId(commentId)){
        throw new ApiError(400, "Invalid commentId")
    }
    const comment = await Comment.findById(commentId)
    if(!comment){
        throw new ApiError(404, "Comment not found")
    }
    if(comment.owner.toString() !== req.user?._id.toString()){
        throw new ApiError(403, "You are not authorized to delete this comment")
    }
    await Comment.findByIdAndDelete(commentId)

    return res.status(200).json(
        new ApiResponse(200, null, "Comment deleted successfully")
    )
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }