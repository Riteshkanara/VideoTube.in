import { Router } from "express"
import { 
    getVideoComments,
    addComment,
    updateComment,
    deleteComment 
} from "../controllers/comment.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

// Get all comments for a video (public, no auth needed)
router.route("/:videoId").get(getVideoComments)

// Add comment to video (requires auth)
router.route("/:videoId").post(verifyJWT, addComment)

// Update comment (requires auth)
router.route("/c/:commentId").patch(verifyJWT, updateComment)

// Delete comment (requires auth)
router.route("/c/:commentId").delete(verifyJWT, deleteComment)

export default router