import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"

const getAllVideos = asyncHandler(async (req, res) => {
    const {page = 1, limit = 10,  query, sortBy, sortType, userId } = req.query;
    
    const pageNum = Math.max(parseInt(req.query.page) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 100);
    
    const sortField = sortBy || "createdAt";
    const sortOrder = sortType === "asc" ? 1 : -1;
    
    const skip = (page - 1) * limit;
    
    // Build match conditions
    const matchConditions = { isPublished: true };
    
    if (userId) {
        if(!isValidObjectId(userId)){
            throw new ApiError (400, "Invalid userId");
        }
        matchConditions.owner = new mongoose.Types.ObjectId(userId);
    }

    const user = await User.aggregate([
        //match 
        {
        $match : {
            _id: new mongoose.Types.ObjectId(userId)
        },
    },
        {
            $lookup: {
                from:"videos",
                localField:"_id",
                foreignField:"videos",
                as:"videos"
            }
                
        },
        //unwind the videos array to process each video individually
        {
            $unwind: "$videos"
        },
        //match published videos
        {
            $match: {
                ...(query && {"videos.title":{regex:query, $options:"i"}}),
        }
        },
        {
            $sort:{
                [`videos.${sortBy}`]: sortType === "asc" ? 1: -1 ;
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
        throw new ApiError (404, "No videos found for the specified user");
    }

    // Extract videos from the aggregated result
    const videos = user[0].videos;
    const totalVideos = await Video.countDocuments(matchConditions);
    
    // Return with pagination metadata
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
    // TODO: get video, upload to cloudinary, create video

    if(title.trim().length === 0){
        throw new ApiError(400, "Title cannot be empty")
    }
    if(description.trim().length === 0){
        throw new ApiError(400, "Description cannot be empty")
    }

    // if(!videoFile){
    //     throw new ApiError(400, "Video file is required")
    // }
    // if(!thumbnailFile){
    //     throw new ApiError(400, "Thumbnail file is required")
    // }

    const videoLocalPath = req.files?.videoFile?.[0].path
    const thumbnailLocalPath = req.files?.thumbnailFile?.[0].path

    if(!videoLocalPath){
        throw new ApiError(400, "Video file is required")
    }
    if(!thumbnailLocalPath){
        throw new ApiError(400, "Thumbnail file is required")
    }

    const videoUpload = await uploadOnCloudinary(videoLocalPath, {resourceType: "video"})
    const thumbnailUpload = await uploadOnCloudinary(thumbnailLocalPath, {resourceType: "image"})

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
    const createdvideo = await Video.findById(newVideo._id).populate("owner", "username email avatar")
    if(!createdvideo){
        throw new ApiError(500, "Video creation failed")
    }

    return res.status(201).json(
        new ApiResponse(
            201,
            newVideo,
            "Video published successfully"
            )
    )
}


)

const getVideoById = asyncHandler(async (req, res) => {
    // Step 1: Extract and Validate videoId
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID format");
    }

    // Step 2-6: Build Aggregation Pipeline
    const video = await Video.aggregate([
        // Step 2: Match by videoId
        {
            $match: {
                _id: new mongoose.Types.ObjectId(videoId)
            }
        },
        // Step 3 & 4: Lookup Owner Details and their Subscribers
        {
            $lookup: {
                from: "users", // ensure this matches your DB collection name (usually lowercase/plural)
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    {
                        // Step 4: Lookup subscribers for this specific owner
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
                            // Step 5: Check if current user is subscribed to this owner
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
                        // Project only the fields we want to expose
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
        // Step 6: Clean up Owner Data (Convert array to object)
        {
            $addFields: {
                owner: {
                    $first: "$owner"
                }
            }
        }
    ]);

    // Step 7: Execute and Handle Result
    if (!video?.length) {
        throw new ApiError(404, "Video does not exist");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, video[0], "Video fetched successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail

    const {title,description} = req.body
    const {thumbnailFile} = req.files || {}

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

    const thumbnailLocalPath = req.files?.thumbnailFile?.[0].path
    let thumbnailUpload ;
    if(thumbnailLocalPath){
        thumbnailUpload = await uploadOnCloudinary(thumbnailLocalPath, {resourceType: "image"})
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
export { getAllVideos, publishVideo,getVideoById }