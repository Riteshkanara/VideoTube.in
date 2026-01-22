import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

const uploadOnCloudinary = async (localFilePath) => {
    try {
        console.log("📁 Uploading file:", localFilePath);
        
        if (!localFilePath) {
            console.log("❌ No file path provided");
            return null;
        }
        cloudinary.config({ 
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
            api_key: process.env.CLOUDINARY_API_KEY, 
            api_secret: process.env.CLOUDINARY_API_SECRET 
});

        // Configure inline with CLOUDINARY_URL format
        // const cloudinaryUrl = `cloudinary://${process.env.CLOUDINARY_API_KEY}:${process.env.CLOUDINARY_API_SECRET}@${process.env.CLOUDINARY_CLOUD_NAME}`;
        
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
            // Pass config explicitly via URL
            // api_key: process.env.CLOUDINARY_API_KEY,
            // api_secret: process.env.CLOUDINARY_API_SECRET,
            // cloud_name: process.env.CLOUDINARY_CLOUD_NAME
        });
        
        console.log("✅ File uploaded to cloudinary:", response.url);
        fs.unlinkSync(localFilePath);
        return response;

    } catch (error) {
        console.error("❌ Cloudinary upload error:", error.message);
        
        if (localFilePath && fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        return null;
    }
}

export { uploadOnCloudinary }