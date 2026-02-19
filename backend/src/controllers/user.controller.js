import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { OAuth2Client } from 'google-auth-library'


const generateAccessAndRefreshTokens = async(userId) => {

    try {
       const user = await User.findById(userId);
       const accessToken = user.generateAccessToken();
       const refreshToken = user.generateRefreshToken();
       
       user.refreshToken = refreshToken
       await user.save({validateBeforeSave : false})

       return {accessToken, refreshToken}



    } catch (error) {
        throw new ApiError(500,"Something went wrong while generating Tokens ")
        
    }
}

// Google Authentication: 

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleAuth = async (req, res) => {
    try {
        const { token } = req.body;
        
        // 1. Verify the Google Token
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const { email, name, picture } = ticket.getPayload();

        // 2. Find or Create User
        let user = await User.findOne({ email });

        if (!user) {
            // Generate a random username if they are new
            const baseUsername = email.split('@')[0].toLowerCase();
            user = await User.create({
                fullName: name,
                email,
                avatar: picture,
                username: `${baseUsername}${Math.floor(Math.random() * 1000)}`,
                password: Math.random().toString(36).slice(-10), // Random password
                isSocialLogin: true // Add this field to your model if you want to track it
            });
        }

        // 3. Generate your App's JWT tokens
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        const options = { httpOnly: true, secure: true };

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json({
                success: true,
                user,
                accessToken,
                message: "Logged in with Google successfully"
            });

    } catch (error) {
        res.status(401).json({ success: false, message: "Google verification failed" });
    }
};

const registerUser = asyncHandler( async (req, res) => {

    const {fullName, email, username, password } = req.body

    if (
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }

    // ✅ STEP 1: Check if files exist
    console.log("🔍 req.files:", req.files)
    
    const avatarLocalPath = req.files?.avatar?.[0]?.path;  // ← Added optional chaining
    
    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path;
    }
    
    // ✅ STEP 2: Check paths
    console.log("📁 Avatar path:", avatarLocalPath)
    console.log("📁 Cover path:", coverImageLocalPath)

    if (!avatarLocalPath) {
        throw new ApiError(402, "Avatar file is required");
    }

    // ✅ STEP 3: Check environment variables
    console.log("🔍 ENV Check:");
    console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
    console.log("API Key:", process.env.CLOUDINARY_API_KEY);
    console.log("API Secret exists:", !!process.env.CLOUDINARY_API_SECRET);

    // ✅ STEP 4: Try uploading
    console.log("⏳ Starting upload...")
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    console.log("📤 Avatar upload result:", avatar)  // ← THIS IS KEY!
    
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    console.log("📤 Cover upload result:", coverImage)

    // ✅ STEP 5: Check if upload was successful
    if (!avatar) {
        throw new ApiError(400, "Avatar upload failed - uploadOnCloudinary returned null");
    }

    // Create User
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    );
});

const loginUser = asyncHandler( async (req,res) => {
    // res.send("login user route")
    // req body -> data
    // username or email
    //find the user
    //password check
    //access and referesh token
    //send cookie

    const {email,username,password} = req.body;
    console.log(email);

    if(!username && !email){
        throw new ApiError(400,"username or email is required")
    }

    // Here is an alternative of above code based on logic discussed in video:
    // if (!(username || email)) {
    //     throw new ApiError(400, "username or email is required")
        
    // }

    const user = await User.findOne({
        $or:[{username},{email}]
    }).select("+password");

    if(!user){
        throw new ApiError(404,"user does not exist ")
    }
    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly:true,
        secure:true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options )
    .cookie("refreshToken", refreshToken, options )
    .json(
        new ApiResponse (200,
            {
                user:loggedInUser,accessToken, refreshToken
            },
            "User logged in successfully."
        )
    )

    

}) 

const logoutUser = asyncHandler (async (req,res) => {
        await User.findByIdAndUpdate(
            req.user._id,
            {
                $unset: {refreshToken: 1}
            },
            {
                new:true
            }
        )
        const options = {
            httpOnly:true,
            secure:true,
        }

        return res
        .status(200)
        .clearCookie("accessToken",options)
        .clearCookie("refreshToken",options)
        .json(new ApiResponse(200,{},"User logged out."))
})

const refreshAccessToken = asyncHandler (async (req,res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new ApiError (401,"Refresh token is missing")
    }

    try{
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET,
        )
        const user = await User.findById(decodedToken?._id)

        if (!user){
            throw new ApiError (401,"Invalid refresh token - user not found")
        }

        if (user.refreshToken !== incomingRefreshToken){
            throw new ApiError (401,"Refresh token does not match(Expired / Invalid)")
        }
        
        const options = {
            httpOnly:true,
            secure:true,
        }
        const {accessToken, newRefreshToken} = await generateAccessAndRefreshTokens(user._id)

        return res
            .status (200)
            .cookie ("accessToken", accessToken, options)
            .cookie ("refreshToken", newRefreshToken, options)
            .json (
                new ApiResponse (200,
                    {
                        accessToken,
                        refreshToken: newRefreshToken
                    },
                    "Access token refreshed successfully."
                )
            )
    } catch (error){
        throw new ApiError (401, error?.message || "Invalid refresh token.")
    }
})

const changeCurrentPassword = asyncHandler (async (req,res) => {
    const {oldPassword, newPassword} = req.body

    const user = await User.findById (req.user._id)
    const isPasswordValid = await user.isPasswordCorrect(oldPassword)

    if(!isPasswordValid){
        throw new ApiError (400,"Old password is incorrect.")
    }

    user.password = newPassword
    await user.save({validateBeforeSave: false})

    return res
        .status (200)
        .json (
            new ApiResponse (200,{}, "Password changed successfully.")
        )       

})

const getCurrentUser = asyncHandler (async (req,res) => {
    return res
        .status (200)
        .json (
            new ApiResponse (200, req.user, "Current user fetched successfully.")
            )
})

const updateAccountDetails = asyncHandler(async(req, res) => {
    const {fullName, email} = req.body

    if (!fullName || !email) {
        throw new ApiError(400, "All fields are required")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName,
                email: email
            }
        },
        {new: true}
        
    ).select("-password")

    return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"))
});

const updateUserAvatar = asyncHandler(async(req, res) => {
    const avatarLocalPath = req.file?.path

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is missing")
    }

    //TODO: delete old image - assignment

    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if (!avatar.url) {
        throw new ApiError(400, "Error while uploading on avatar")
        
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                avatar: avatar.url
            }
        },
        {new: true}
    ).select("-password")

    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "Avatar image updated successfully")
    )
})

const updateUserCoverImage = asyncHandler(async(req, res) => {
    const coverImageLocalPath = req.file?.path;

    if(!coverImageLocalPath){
        throw new ApiError(401,"Cover image file is missing")
    }
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if(!coverImage.url){
        throw new ApiError(400,"Error while uploading cover image")
    }
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                coverImage: coverImage.url
            }
        },
        {new: true}
    ).select("-password")
    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "Cover image updated successfully")
    )
})

const getUserChannelProfile = asyncHandler(async(req, res) => {
    const { username } = req.params;

    if (!username?.trim()) {
        throw new ApiError(400, "username is missing")
    }

    // ✅ Extract it BEFORE the pipeline so MongoDB can use it as a plain value
    const currentUserId = req.user?._id;

    const channel = await User.aggregate([
        {
            $match: {
                username: username?.toLowerCase()
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },
        {
            $addFields: {
                subscribersCount: { $size: "$subscribers" },
                channelsSubscribedToCount: { $size: "$subscribedTo" },
                isSubscribed: {
                    $cond: {
                        // ✅ Use the variable, not req.user?._id
                        if: { $in: [currentUserId, "$subscribers.subscriber"] },
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
                subscribersCount: 1,
                channelsSubscribedToCount: 1,
                isSubscribed: 1,
                avatar: 1,
                coverImage: 1,
                email: 1
            }
        }
    ])

    if (!channel?.length) {
        throw new ApiError(404, "channel does not exists")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, channel[0], "User channel fetched successfully"))
})

const getWatchHistory = asyncHandler(async(req, res) => {
    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        fullName: 1,
                                        username: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields:{
                            owner:{
                                $first: "$owner"
                            }
                        }
                    }
                ]
            }
        }
    ])

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            user[0].watchHistory,
            "Watch history fetched successfully"
        )
    )
})



export { registerUser, loginUser, logoutUser,
refreshAccessToken, changeCurrentPassword ,getCurrentUser,
updateAccountDetails, updateUserAvatar,
updateUserCoverImage,getUserChannelProfile, getWatchHistory};