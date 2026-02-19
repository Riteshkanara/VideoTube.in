import { Router } from "express";
import { createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet,
    getAllTweets} from "../controllers/tweet.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", verifyJWT, createTweet);
router.get("/",verifyJWT, getAllTweets);
router.get("/:userId", verifyJWT, getUserTweets);
router.put("/:tweetId", verifyJWT, updateTweet);
router.delete("/:tweetId", verifyJWT, deleteTweet);

export default router;