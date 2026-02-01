import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body
    //TODO: create playlist

    if(!name || name.trim() === ""){
        throw new ApiError(400, "Playlist name cannot be empty");
    }

    //Not Needed because you are 
    // const userId = req.user._id;
    // if(!isValidObjectId(userId)){
    //     throw new ApiError(401, "Unauthorized");
    // }

    const playlist = await Playlist.create({
        name,
        description : description || "",
        owner: req.user._id,
        videos: []

    },
);

    return res.status(201).json(new ApiResponse(
        201,
        playlist,
        "Playlist created successfully"));

})


const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists

    if(!isValidObjectId(userId)){
        throw new ApiError(400, "Invalid user ID");
    }
    const user = await User.findById(userId);
    if(!user){
        throw new ApiError(404, "User not found");
    }

    const playlists = await Playlist.find(
        {
           owner: userId
            
        }).populate({
            path: "videos",
            select: "title duration thumbnail"
        }).sort({createdAt: -1});

    if(!playlists || playlists.length === 0){
        throw new ApiError(404, "No playlists found for this user");
    }
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
    const playlist = await Playlist.findById(playlistId).populate({
        path: "videos",
        select: "title duration thumbnail"
    });
    if(!playlist){
        throw new ApiError(404, "Playlist not found");
    }
    return res.status(200).json(new ApiResponse(
        200,
        playlist,
        "Playlist fetched successfully"));
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist
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