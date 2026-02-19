import { v2 as cloudinary } from "cloudinary"
import fs from "fs"

const uploadOnCloudinary = async (localFilePath, options = {}) => {
    try {
        // Configure Cloudinary FIRST
        cloudinary.config({ 
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
            api_key: process.env.CLOUDINARY_API_KEY, 
            api_secret: process.env.CLOUDINARY_API_SECRET 
        })
        
        console.log("📁 Uploading file:", localFilePath)
        console.log("🔑 Config:", {
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY ? "✅ Set" : "❌ Missing",
            api_secret: process.env.CLOUDINARY_API_SECRET ? "✅ Set" : "❌ Missing"
        })
        
        if (!localFilePath) {
            console.log("❌ No file path provided")
            return null
        }

        // ✅ Check if file exists
        if (!fs.existsSync(localFilePath)) {
            console.log("❌ File does not exist at path:", localFilePath)
            return null
        }

        console.log("✅ File exists, starting upload...")

        // Upload the file to Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
            secure: true,
            use_filename: true,
            ...options
        })
        
        console.log("✅ File uploaded to cloudinary:", response.url)
        
        // File uploaded successfully, delete local file
        fs.unlinkSync(localFilePath)
        
        return response

    } catch (error) {
        console.error("❌ Cloudinary upload error:", error.message)
        console.error("❌ Full error:", error)  // ← See full error details
        
        // Upload failed, remove the locally saved temporary file
        if (localFilePath && fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath)
        }
        return null
    }
}

const deleteFromCloudinary = async (publicId, resourceType = "image") => {
    try {
        cloudinary.config({ 
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
            api_key: process.env.CLOUDINARY_API_KEY, 
            api_secret: process.env.CLOUDINARY_API_SECRET 
        })
        
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

const deleteVideoFromCloudinary = async (publicId) => {
    try {
        cloudinary.config({ 
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
            api_key: process.env.CLOUDINARY_API_KEY, 
            api_secret: process.env.CLOUDINARY_API_SECRET 
        })
        
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

const extractPublicId = (url) => {
    if (!url) return null
    
    const parts = url.split('/')
    const fileWithExtension = parts[parts.length - 1]
    const publicId = fileWithExtension.split('.')[0]
    
    return publicId
}

export {
    uploadOnCloudinary,
    deleteFromCloudinary,
    deleteVideoFromCloudinary,
    extractPublicId
}