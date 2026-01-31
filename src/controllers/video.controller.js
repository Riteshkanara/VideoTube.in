import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { 
    uploadOnCloudinary, 
    deleteFromCloudinary,
    extractPublicId 
} from "../utils/cloudinary.js"

const getAllVideos = asyncHandler(async (req, res) => {
    const {page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
    
    const pageNum = Math.max(parseInt(req.query.page) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 100);
    
    const sortField = sortBy || "createdAt";
    const sortOrder = sortType === "asc" ? 1 : -1;
    
    const skip = (page - 1) * limit;
    
    const matchConditions = { isPublished: true };
    
    if (userId) {
        if(!isValidObjectId(userId)){
            throw new ApiError(400, "Invalid userId");
        }
        matchConditions.owner = new mongoose.Types.ObjectId(userId);
    }

    const user = await User.aggregate([
        {
            $match : {
                _id: new mongoose.Types.ObjectId(userId)
            },
        },
        {
            $lookup: {
                from:"videos",
                localField:"_id",
                foreignField:"owner",  // ✅ FIXED: Should be "owner", not "videos"
                as:"videos"
            }
        },
        {
            $unwind: "$videos"
        },
        {
            $match: {
                "videos.isPublished": true,  // ✅ FIXED: Added this
                ...(query && {"videos.title":{$regex: query, $options:"i"}}),  // ✅ FIXED: Added $
            }
        },
        {
            $sort:{
                [`videos.${sortBy || "createdAt"}`]: sortType === "asc" ? 1 : -1  // ✅ FIXED: Syntax
            }
        },
        {
            $skip: skip 
        },
        {
            $limit: limitNum 
        },
        {
            $group:{
                _id: "$_id",
                videos: { $push: "$videos" }
            }
        },
    ])

    if(!user.length){
        throw new ApiError(404, "No videos found for the specified user");
    }

    const videos = user[0].videos;
    const totalVideos = await Video.countDocuments(matchConditions);
    
    return res.status(200).json(
        new ApiResponse(200, {
            videos,
            pagination: {
                currentPage: page,
                pageSize: limit,
                totalVideos,
                totalPages: Math.ceil(totalVideos / limit),
                hasNextPage: page * limit < totalVideos,
                hasPreviousPage: page > 1
            }
        }, "Videos fetched successfully")
    );
});

const publishVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body

    if(!title || title.trim().length === 0){  // ✅ FIXED: Check if exists first
        throw new ApiError(400, "Title is required and cannot be empty")
    }
    if(!description || description.trim().length === 0){
        throw new ApiError(400, "Description is required and cannot be empty")
    }

    const videoLocalPath = req.files?.videoFile?.[0]?.path
    const thumbnailLocalPath = req.files?.thumbnailFile?.[0]?.path

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

    const newVideo = await Video.create({
        title,
        description,
        videoFile: videoUpload.url,
        thumbnailFile: thumbnailUpload.url,
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

    const video = await Video.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(videoId)
            }
        },
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
                            username: 1,
                            avatar: 1,
                            subscribersCount: 1,
                            isSubscribed: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                owner: {
                    $first: "$owner"
                }
            }
        }
    ]);

    if (!video?.length) {
        throw new ApiError(404, "Video does not exist");
    }

    return res.status(200).json(
        new ApiResponse(200, video[0], "Video fetched successfully")
    );
});

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const {title, description} = req.body

    if (!title && !description && !req.files?.thumbnailFile) {
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

    const thumbnailLocalPath = req.files?.thumbnailFile?.[0]?.path
    let thumbnailUpload;
    
    if(thumbnailLocalPath){
        if (video.thumbnailFile) {  // ✅ FIXED
            const oldPublicId = extractPublicId(video.thumbnailFile)  // ✅ FIXED
            await deleteFromCloudinary(oldPublicId, "image")
        }

        thumbnailUpload = await uploadOnCloudinary(thumbnailLocalPath, {resource_type: "image"})
        if(!thumbnailUpload?.url){
            throw new ApiError(500, "Thumbnail upload failed")
        }
    }

    video.title = title || video.title
    video.description = description || video.description
    video.thumbnailFile = thumbnailUpload?.url || video.thumbnailFile

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
    const thumbnailPublicId = extractPublicId(video.thumbnailFile)  // ✅ FIXED
    
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

    // ✅ FIXED: Correct toggle logic
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
    togglePublishStatus  // ✅ ADDED!
}