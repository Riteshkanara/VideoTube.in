import multer from "multer"
import path from "path"
import crypto from "crypto"  // built-in Node, no install needed

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname)
        const uniqueName = crypto.randomBytes(16).toString("hex")
        cb(null, `${uniqueName}${ext}`)
    }
})

export const upload = multer({
    storage,
    limits: { fileSize: 100 * 1024 * 1024 }  // 100MB limit
})
