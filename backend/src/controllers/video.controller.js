import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { uploadOnCloudinary,deleteFromCloudinary,extractPublicId } from "../utils/cloudinary.js"

const getAllVideos = asyncHandler(async (req, res) => {
    const {page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
    
    const pageNum = Math.max(parseInt(page) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit) || 10, 1), 100);
    
    const sortField = sortBy || "createdAt";
    const sortOrder = sortType === "asc" ? 1 : -1;
    
    const skip = (pageNum - 1) * limitNum;
    
    // 🌟 FIX 1: Start with an empty match object
    const matchConditions = {};
    
    if (userId) {
        if(!isValidObjectId(userId)){
            throw new ApiError(400, "Invalid userId");
        }
        matchConditions.owner = new mongoose.Types.ObjectId(userId);
        
        // 🌟 FIX 2: The Smart Rule
        // If the logged-in user is asking for their OWN videos, let them see everything.
        // If it's a stranger (or a logged-out user), ONLY show published videos!
        if (req.user?._id?.toString() !== userId) {
            matchConditions.isPublished = true;
        }
    } else {
        // If we are on the global Home Feed, ONLY show published videos
        matchConditions.isPublished = true;
    }

    if (query) {
        matchConditions.title = { $regex: query, $options: "i" };
    }

    const videos = await Video.find(matchConditions)
        .sort({ [sortField]: sortOrder })
        .skip(skip)
        .limit(limitNum)
        .populate("owner", "username email avatar");

    const totalVideos = await Video.countDocuments(matchConditions);
    
    return res.status(200).json(
        new ApiResponse(200, {
            videos,
            pagination: {
                currentPage: pageNum,
                pageSize: limitNum,
                totalVideos,
                totalPages: Math.ceil(totalVideos / limitNum),
                hasNextPage: pageNum * limitNum < totalVideos,
                hasPreviousPage: pageNum > 1
            }
        }, "Videos fetched successfully")
    );
});

const publishVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body

    if(!title || title.trim().length === 0){
        throw new ApiError(400, "Title is required and cannot be empty")
    }
    if(!description || description.trim().length === 0){
        throw new ApiError(400, "Description is required and cannot be empty")
    }

    // ✅ FIXED: Match route field names
    const videoLocalPath = req.files?.videoFile?.[0]?.path
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path

    if(!videoLocalPath){
        throw new ApiError(400, "Video file is required")
    }
    if(!thumbnailLocalPath){
        throw new ApiError(400, "Thumbnail file is required")
    }

    const videoUpload = await uploadOnCloudinary(videoLocalPath, {resource_type: "video"})
    const thumbnailUpload = await uploadOnCloudinary(thumbnailLocalPath, {resource_type: "image"})

    if(!videoUpload?.url || !thumbnailUpload?.url){
        throw new ApiError(500, "Video upload failed")
    }
    if(videoUpload?.url){
        videoUpload.url = videoUpload.url.replace("http://","https://")
    }
    if(thumbnailUpload?.url){
        thumbnailUpload.url = thumbnailUpload.url.replace("http://","https://")
    }

    // ✅ FIXED: Use consistent field names
    const newVideo = await Video.create({
        title,
        description,
        videoFile: videoUpload.url,
        thumbnail: thumbnailUpload.url,  // ✅ Changed from thumbnailFile
        duration: videoUpload.duration,
        owner: req.user._id,
        isPublished: true,
    })
    
    const createdVideo = await Video.findById(newVideo._id).populate("owner", "username email avatar")
    
    if(!createdVideo){
        throw new ApiError(500, "Video creation failed")
    }

    return res.status(201).json(
        new ApiResponse(201, createdVideo, "Video published successfully")
    )
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID format");
    }

    await Video.findByIdAndUpdate(videoId, { $inc: { views: 1 } });

    const video = await Video.aggregate([
        // 1. MATCH: Find the specific video first
        {
            $match: {
                _id: new mongoose.Types.ObjectId(videoId)
            }
        },
        // 2. LOOKUP LIKES: Check how many likes this video has
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "video",
                as: "likes"
            }
        },
        // 3. LOOKUP OWNER: Get the channel owner details and sub status
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    {
                        $lookup: {
                            from: "subscriptions",
                            localField: "_id",
                            foreignField: "channel",
                            as: "subscribers"
                        }
                    },
                    {
                        $addFields: {
                            subscribersCount: { $size: "$subscribers" },
                            // Is the CURRENT user in the subscribers list?
                            isSubscribed: {
                                $cond: {
                                    if: { $in: [req.user?._id, "$subscribers.subscriber"] },
                                    then: true,
                                    else: false
                                }
                            }
                        }
                    },
                    {
                        $project: {
                            fullName: 1,
                            username: 1,
                            avatar: 1,
                            subscribersCount: 1,
                            isSubscribed: 1
                        }
                    }
                ]
            }
        },
        // 4. ADD FINAL FIELDS: Flatten the arrays and calculate top-level booleans
        {
            $addFields: {
                owner: { $first: "$owner" }, // Turns array of 1 into an object
                likesCount: { $size: "$likes" }, // Total likes
                // Is the CURRENT user in the likes list?
                isLiked: {
                    $cond: {
                        if: { $in: [req.user?._id, "$likes.likedBy"] },
                        then: true,
                        else: false
                    }
                }
            }
        },
        // 5. CLEAN UP: Remove the heavy arrays we don't need to send to frontend
        {
            $project: {
                likes: 0 // We only need likesCount and isLiked, not the whole array
            }
        }
    ]);

    if (!video?.length) {
        throw new ApiError(404, "Video does not exist");
    }

    // 6. EXTRACT isSubscribed TO TOP LEVEL
    // The frontend expects response.isSubscribed, but right now it's hiding inside response.owner.isSubscribed
    const videoData = video[0];
    
    // Move isSubscribed to the root of the object for the frontend
    videoData.isSubscribed = videoData.owner.isSubscribed;

    return res.status(200).json(
        new ApiResponse(200, videoData, "Video fetched successfully")
    );
});

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const {title, description} = req.body

    // ✅ FIXED: Match route field name
    if (!title && !description && !req.files?.thumbnail) {
        throw new ApiError(400, "At least one field is required to update")
    }

    if(title && title.trim().length === 0){
        throw new ApiError(400, "Title cannot be empty")
    }
    if(description && description.trim().length === 0){
        throw new ApiError(400, "Description cannot be empty")
    }
    
    const video = await Video.findById(videoId)
    if(!video){
        throw new ApiError(404, "Video not found")
    }
    if(video.owner.toString() !== req.user._id.toString()){
        throw new ApiError(403, "You are not authorized to update this video")
    }

    // ✅ FIXED: Match route field name
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path
    let thumbnailUpload;
    
    if(thumbnailLocalPath){
        // ✅ FIXED: Use consistent field name
        if (video.thumbnail) {
            const oldPublicId = extractPublicId(video.thumbnail)
            await deleteFromCloudinary(oldPublicId, "image")
        }

        thumbnailUpload = await uploadOnCloudinary(thumbnailLocalPath, {resource_type: "image"})
        if(!thumbnailUpload?.url){
            throw new ApiError(500, "Thumbnail upload failed")
        }
    }

    video.title = title || video.title
    video.description = description || video.description
    video.thumbnail = thumbnailUpload?.url || video.thumbnail  // ✅ FIXED

    await video.save()

    return res.status(200).json(
        new ApiResponse(200, video, "Video updated successfully")
    )
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid videoId")
    }

    const video = await Video.findById(videoId)

    if(!video){
        throw new ApiError(404, "Video not found")
    }

    if(video.owner.toString() !== req.user._id.toString()){
        throw new ApiError(403, "You are not authorized to delete this video")
    }

    const videoPublicId = extractPublicId(video.videoFile)
    const thumbnailPublicId = extractPublicId(video.thumbnail)  // ✅ FIXED
    
    await deleteFromCloudinary(videoPublicId, "video")
    await deleteFromCloudinary(thumbnailPublicId, "image")

    await Video.findByIdAndDelete(videoId)

    return res.status(200).json(
        new ApiResponse(200, null, "Video deleted successfully")
    )
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid videoId")
    }
    
    const video = await Video.findById(videoId)
    
    if(!video){
        throw new ApiError(404, "Video not found")
    }
    
    if(video.owner.toString() !== req.user._id.toString()){
        throw new ApiError(403, "You are not authorized to update this video")
    }

    video.isPublished = !video.isPublished
    await video.save()

    return res.status(200).json(
        new ApiResponse(200, video, "Video publish status toggled successfully")
    )
})

export { 
    getAllVideos, 
    publishVideo, 
    getVideoById, 
    updateVideo, 
    deleteVideo, 
    togglePublishStatus
}