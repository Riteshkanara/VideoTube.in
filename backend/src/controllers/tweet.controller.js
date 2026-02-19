import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    const {content} = req.body;
    
    if(!content || content.trim() === ""){
        throw new ApiError(400, "Tweet content cannot be empty");
    }

    const tweet = await Tweet.create({
        content: content,
        owner: req.user._id
    });

    return res.status(201).json(
        new ApiResponse(201, tweet, "Tweet created successfully")
    );
});

const getUserTweets = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid userId");
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const loggedInUser = req.user?._id;

    // 🌟 UPGRADE: Exact same pipeline, just added a $match at the top!
    const tweets = await Tweet.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    { $project: { username: 1, fullName: 1, avatar: 1 } }
                ]
            }
        },
        { $unwind: "$owner" },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "tweet",
                as: "likesData"
            }
        },
        {
            $addFields: {
                likesCount: { $size: "$likesData" },
                isLiked: {
                    $cond: {
                        if: { $in: [loggedInUser, "$likesData.likedBy"] },
                        then: true,
                        else: false
                    }
                }
            }
        },
        { $project: { likesData: 0 } },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit }
    ]);

    return res.status(200).json(
        new ApiResponse(200, tweets, "User tweets fetched successfully")
    );
});

const updateTweet = asyncHandler(async (req, res) => {
    const {tweetId} = req.params;
    const {content} = req.body;

    if(!isValidObjectId(tweetId)){
        throw new ApiError(400, "Invalid tweet ID");
    }
    
    if(!content || content.trim() === ""){
        throw new ApiError(400, "Tweet content cannot be empty");
    }

    const tweet = await Tweet.findById(tweetId);
    
    if(!tweet){
        throw new ApiError(404, "Tweet not found");
    }
    
    if(tweet.owner.toString() !== req.user._id.toString()){
        throw new ApiError(403, "Forbidden: You can only update your own tweets");
    }

    const updatedTweet = await Tweet.findByIdAndUpdate(
        tweetId,
        {content: content},
        {new: true}
    );

    return res.status(200).json(
        new ApiResponse(200, updatedTweet, "Tweet updated successfully")
    );
});

const deleteTweet = asyncHandler(async (req, res) => {
    const {tweetId} = req.params;

    if(!isValidObjectId(tweetId)){
        throw new ApiError(400, "Invalid tweet ID");
    }

    const tweet = await Tweet.findById(tweetId);
    
    if(!tweet){
        throw new ApiError(404, "Tweet not found");
    }
    
    if(tweet.owner.toString() !== req.user._id.toString()){
        throw new ApiError(403, "Forbidden: You can only delete your own tweets");
    }

    await Tweet.findByIdAndDelete(tweetId);

    return res.status(200).json(
        new ApiResponse(200, null, "Tweet deleted successfully")
    );
});

const getAllTweets = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const userId = req.user?._id;

    // 🌟 UPGRADE: Replaced Tweet.find() with Aggregation Pipeline
    const tweets = await Tweet.aggregate([
        // 1. Get Owner Data
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    { $project: { username: 1, fullName: 1, avatar: 1 } }
                ]
            }
        },
        // 2. Flatten the owner array
        { $unwind: "$owner" },
        // 3. Get Likes Data
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "tweet",
                as: "likesData"
            }
        },
        // 4. Calculate likesCount and isLiked
        {
            $addFields: {
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
        // 5. Clean up
        { $project: { likesData: 0 } },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit }
    ]);

    return res.status(200).json(
        new ApiResponse(200, tweets, "All tweets fetched successfully")
    );
});


export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet,
    getAllTweets
}