import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import  {User} from "../models/user.model.js"
import {Video} from "../models/video.model.js"


const createPlaylist = asyncHandler(async (req, res) => {
    // 🌟 1. Extract 'videos' array from the request body
    const { name, description, videos } = req.body;

    if (!name || name.trim() === "") {
        throw new ApiError(400, "Playlist name is required");
    }

    // 🌟 2. Validate the videos array if it exists
    let videoIds = [];
    if (videos && Array.isArray(videos)) {
        // Filter out any invalid ObjectIds to prevent crashes
        videoIds = videos.filter(id => isValidObjectId(id));
    }

    // 🌟 3. Create the playlist WITH the videos
    const playlist = await Playlist.create({
        name,
        description: description || "",
        videos: videoIds, // Array of video IDs added instantly!
        owner: req.user._id
    });

    if (!playlist) {
        throw new ApiError(500, "Failed to create playlist");
    }
 
    return res.status(201).json(
        new ApiResponse(201, playlist, "Playlist created successfully")
    );
}); 


const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists

    if(!isValidObjectId(userId)){
        throw new ApiError(400, "Invalid user ID");
    }
    //It does'nt make sense to check if user exists every time we fetch playlists
    // const user = await User.findById(userId);
    // if(!user){
    //     throw new ApiError(404, "User not found");
    // }

    const playlists = await Playlist.find(
        {
           owner: userId
            
        }).populate({
            path: "videos",
            select: "title duration thumbnail"
        }).sort({createdAt: -1});

    // if(!playlists || playlists.length === 0){
    //     throw new ApiError(404, "No playlists found for this user");
    // }
    return res.status(200).json(new ApiResponse(
        200,
        playlists,
        "User playlists fetched successfully"));
  

})


const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id
    if(!isValidObjectId(playlistId)){
        throw new ApiError(400, "Invalid playlist ID");
    }
    const playlist = await Playlist.findById(playlistId)
    .populate({
        path: "videos",
        select: "title thumbnail duration views createdAt owner", // 🌟 Ensure 'views' is here
        populate: {
            path: "owner",
            select: "username fullName avatar"
        }
    })
    .populate("owner", "username fullName avatar");

    if(!playlist){
        throw new ApiError(404, "Playlist not found");
    }
    return res.status(200).json(new ApiResponse(
        200,
        playlist,
        "Playlist fetched successfully"));
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params;

    // Validate IDs
    if(!isValidObjectId(playlistId) || !isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid playlist ID or video ID");
    }

    // Check if playlist exists and get it
    const playlist = await Playlist.findById(playlistId);
    if(!playlist){
        throw new ApiError(404, "Playlist not found");
    }

    // Check ownership BEFORE modifying
    if(playlist.owner.toString() !== req.user._id.toString()){
        throw new ApiError(403, "Forbidden: You are not the owner of this playlist");
    }

    // Verify video exists
    const video = await Video.findById(videoId);
    if(!video){
        throw new ApiError(404, "Video not found");
    }

    // Check if video already in playlist
    if(playlist.videos.includes(videoId)){
        throw new ApiError(400, "Video already in playlist");
    }

    // Now update
    playlist.videos.push(videoId);
    await playlist.save();

    return res.status(200).json(
        new ApiResponse(200, playlist, "Video added to playlist successfully")
    );
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params;

    if(!isValidObjectId(playlistId) || !isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid playlist ID or video ID");
    }

    // Find playlist first
    const playlist = await Playlist.findById(playlistId);
    if(!playlist){
        throw new ApiError(404, "Playlist not found");
    }

    // Check ownership
    if(playlist.owner.toString() !== req.user._id.toString()){
        throw new ApiError(403, "Forbidden: You are not the owner of this playlist");
    }

    // Check if video is in playlist
    if(!playlist.videos.includes(videoId)){
        throw new ApiError(400, "Video not in playlist");
    }

    // Update
    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        { $pull: { videos: videoId } },
        { new: true }
    );

    return res.status(200).json(
        new ApiResponse(200, updatedPlaylist, "Video removed from playlist successfully")
    );
});
const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist
    if(!isValidObjectId(playlistId)){
        throw new ApiError(400, "Invalid playlist ID");
    }    
    const playlist = await Playlist.findById(playlistId)

    if(!playlist){
        throw new ApiError(404, "Playlist not found");
    }

    if(playlist.owner.toString() !== req.user._id.toString()){
        throw new ApiError(403, "Forbidden: You are not the owner of this playlist");
    }
    await Playlist.findByIdAndDelete(playlistId)

    return res.status(200).json(new ApiResponse(
        200,
        null,
        "Playlist deleted successfully"));
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist
    if(!isValidObjectId(playlistId)){
        throw new ApiError(400, "Invalid playlist ID");
    }
    if(!name || name.trim() === ""){
        throw new ApiError(400, "Playlist name cannot be empty");
    }
    const playlist = await Playlist.findById(playlistId)
    if(!playlist){
        throw new ApiError(404, "Playlist not found");
    }
    if(playlist.owner.toString() !== req.user._id.toString()){
        throw new ApiError(403, "Forbidden: You are not the owner of this playlist");
    }
    playlist.name = name;
    playlist.description = description || playlist.description;
    await playlist.save();

    return res.status(200).json(new ApiResponse(
        200,
        playlist,
        "Playlist updated successfully"));
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}