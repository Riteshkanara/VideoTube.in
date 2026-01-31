import { Router } from "express";
import { publishVideo,updateVideo,deleteVideo } from "../controllers/video.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/upload-video").post(
    verifyJWT,  // ⭐ Add authentication
    upload.fields([
        {
            name: "video",  // Matches controller
            maxCount: 1
        },
        {
            name: "thumbnail",  // Matches controller
            maxCount: 1
        }
    ]),
    publishVideo
);

router.route("/:videoId").patch(
    verifyJWT,
    upload.fields([{ name: "thumbnailFile", maxCount: 1 }]),
    updateVideo
)

router.route("/:videoId").delete(
    verifyJWT,
    deleteVideo
);

export default router;