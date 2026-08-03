import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import multer from "multer";
import { ApiError } from "./utils/ApiError.js";
const app = express();  // ← ONLY ONCE


const allowedOrigins = [
  'https://video-tube-in-final.vercel.app',
  'https://videotube-riteshkanara.vercel.app',
  'http://localhost:5173',
  'http://localhost:4173',
]

const corsOptions = {
    origin: function(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true
}

app.use(cors(corsOptions))
app.options("*", cors(corsOptions))   // ✅ fixes preflight on mobile upload

// NO app.options line needed

app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));
app.use(cookieParser());

// routes import
import userRouter from "./routes/user.routes.js";
import videoRouter from "./routes/video.routes.js";
import commentRouter from "./routes/comment.routes.js";
import likeRouter from "./routes/like.routes.js";
import tweetRouter from "./routes/tweet.routes.js";
import playlistRouter from "./routes/playlist.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";
import { healthcheck } from "./controllers/healthcheck.controller.js";
import dashboardRouter from "./routes/dashboard.routes.js";

// routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/likes", likeRouter);
app.use("/api/v1/tweets", tweetRouter);
app.use("/api/v1/playlists", playlistRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);
app.use("/api/v1/healthcheck", healthcheck);
app.use("/api/v1/dashboard", dashboardRouter);

// ---- Global error handler (must be last, after all routes) ----
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(413).json({
                success: false,
                message: "File is too large. Max allowed size is 500MB.",
            });
        }
        return res.status(400).json({
            success: false,
            message: `Upload error: ${err.message}`,
        });
    }

    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            errors: err.errors || [],
        });
    }

    console.error(err);
    return res.status(500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
});

export { app };
