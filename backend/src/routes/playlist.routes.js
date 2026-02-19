import Router from "express";
import { createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
} from "../controllers/playlist.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").post(verifyJWT, createPlaylist);
router.route("/user/:userId").get(verifyJWT, getUserPlaylists);
router.route("/:playlistId").get(verifyJWT, getPlaylistById);
router.route("/:playlistId").delete(verifyJWT, deletePlaylist);
router.route("/:playlistId").put(verifyJWT, updatePlaylist);
router.route("/add/:videoId/:playlistId").patch(verifyJWT, addVideoToPlaylist);
router.route("/remove/:videoId/:playlistId/").patch(verifyJWT, removeVideoFromPlaylist);




export default router;
