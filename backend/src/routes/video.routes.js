import { Router } from "express";
import { 
    getAllVideos,
    publishVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus, 
    addToWatchHistory
} from "../controllers/video.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// ✅ FIXED: Use standard REST route
router.route("/upload").post(
    verifyJWT,
    upload.fields([
        {
            name: "videoFile",  // ✅ Matches controller
            maxCount: 1
        },
        {
            name: "thumbnail",  // ✅ Matches controller
            maxCount: 1
        }
    ]),
    publishVideo
);

// Get all videos (with pagination, search, filters)
router.route("/").get(getAllVideos);

// Get specific video by ID
router.route("/:videoId").get(verifyJWT, getVideoById);

// Update video
router.route("/:videoId").patch(
    verifyJWT,
    upload.fields([{ name: "thumbnail", maxCount: 1 }]),  // ✅ FIXED
    updateVideo
);

// Delete video
router.route("/:videoId").delete(
    verifyJWT,
    deleteVideo
);

// Toggle publish status
router.route("/:videoId/toggle-publish").patch(
    verifyJWT,
    togglePublishStatus
);
//for watchHistory route
router.route("/history/:videoId").post(verifyJWT, addToWatchHistory);

export default router;


// ```

// ---

// ## **📊 CHANGES SUMMARY:**

// | Issue | Before | After |
// |-------|--------|-------|
// | **Route path** | `/upload-video` | `/` |
// | **Video field name** | `video` | `videoFile` |
// | **Thumbnail field (publish)** | `thumbnail` | `thumbnail` ✅ |
// | **Thumbnail field (update)** | `thumbnailFile` | `thumbnail` |
// | **Model field** | `thumbnailFile` | `thumbnail` |
// | **Missing routes** | Only 3 routes | All 6 routes ✅ |

// ---

// ## **🎯 NOW IN POSTMAN:**

// ### **Upload Video:**
// ```
// POST http://localhost:8000/api/v1/videos

// Headers:
// Authorization: Bearer YOUR_TOKEN

// Body (form-data):
// videoFile: [File] → Select .mp4
// thumbnail: [File] → Select .jpg
// title: My Test Video
// description: This is a test
// ```

// ### **Update Video:**
// ```
// PATCH http://localhost:8000/api/v1/videos/VIDEO_ID

// Headers:
// Authorization: Bearer YOUR_TOKEN

// Body (form-data):
// thumbnail: [File] → Select new .jpg (optional)
// title: Updated Title (optional)
// description: Updated desc (optional)
