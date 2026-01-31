import { v2 as cloudinary } from "cloudinary"
import fs from "fs"

// ✅ CORRECT: Configure ONCE at the top, OUTSIDE any function
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
})

/**
 * Upload file to Cloudinary
 * @param {string} localFilePath - The local path of the file to upload
 * @param {object} options - Additional Cloudinary upload options
 * @returns {object|null} - Cloudinary upload result or null
 */
const uploadOnCloudinary = async (localFilePath, options = {}) => {
    try {
        console.log("📁 Uploading file:", localFilePath)
        
        if (!localFilePath) {
            console.log("❌ No file path provided")
            return null
        }

        // Upload the file to Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",  // auto-detects file type (image/video/raw)
            ...options              // merge any additional options passed
        })
        
        console.log("✅ File uploaded to cloudinary:", response.url)
        
        // File uploaded successfully, delete local file
        fs.unlinkSync(localFilePath)
        
        return response

    } catch (error) {
        console.error("❌ Cloudinary upload error:", error.message)
        
        // Upload failed, remove the locally saved temporary file
        if (localFilePath && fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath)
        }
        return null
    }
}

/**
 * Delete file from Cloudinary using public_id
 * @param {string} publicId - The public_id of the file to delete
 * @param {string} resourceType - Type of resource (image/video/raw)
 * @returns {object|null} - Cloudinary deletion result or null
 */
const deleteFromCloudinary = async (publicId, resourceType = "image") => {
    try {
        if (!publicId) return null

        const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: resourceType
        })

        console.log("🗑️ File deleted from Cloudinary:", publicId)
        return result
    } catch (error) {
        console.error("❌ Cloudinary deletion error:", error.message)
        return null
    }
}

/**
 * Delete video from Cloudinary using public_id
 * Videos require resource_type: "video"
 * @param {string} publicId - The public_id of the video to delete
 * @returns {object|null} - Cloudinary deletion result or null
 */
const deleteVideoFromCloudinary = async (publicId) => {
    try {
        if (!publicId) return null

        const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: "video"
        })

        console.log("🗑️ Video deleted from Cloudinary:", publicId)
        return result
    } catch (error) {
        console.error("❌ Cloudinary video deletion error:", error.message)
        return null
    }
}

/**
 * Extract public_id from Cloudinary URL
 * @param {string} url - Cloudinary URL
 * @returns {string|null} - Extracted public_id or null
 */
const extractPublicId = (url) => {
    if (!url) return null
    
    // Example URL: https://res.cloudinary.com/demo/image/upload/v1234567890/sample.jpg
    // We want to extract "sample" (the public_id)
    
    const parts = url.split('/')
    const fileWithExtension = parts[parts.length - 1]  // "sample.jpg"
    const publicId = fileWithExtension.split('.')[0]    // "sample"
    
    return publicId
}

export {
    uploadOnCloudinary,
    deleteFromCloudinary,
    deleteVideoFromCloudinary,
    extractPublicId
}