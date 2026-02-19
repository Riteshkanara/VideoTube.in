import { Router } from "express";
import {toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos} from "../controllers/like.controller.js";
import {verifyJWT} from "../middlewares/auth.middleware.js";

const router = Router();

// Toggle like on video
router.route("/video/:videoId").post(verifyJWT, toggleVideoLike);

// Toggle like on comment
router.route("/comment/:commentId").post(verifyJWT, toggleCommentLike);     

// Toggle like on tweet
router.route("/tweet/:tweetId").post(verifyJWT, toggleTweetLike);

// Get all liked videos by the authenticated user
router.route("/videos/liked").get(verifyJWT, getLikedVideos);

export default router;