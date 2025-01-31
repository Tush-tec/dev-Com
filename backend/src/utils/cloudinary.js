import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config(); 


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const uploadOnCloudinary = async (localFilePath) => {
  if (!localFilePath) {
    console.error("No file path provided for upload.");
    return null;
  }

  try {

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "image", 
    });

    console.log("File uploaded to Cloudinary:", response.url);

    // Cleanup local file after successful upload
    if (fs.existsSync(localFilePath)) {
      try {
        fs.unlinkSync(localFilePath);
        console.log("Local file deleted:", localFilePath);
      } catch (err) {
        console.error("Error deleting local file:", err.message || err);
      }
    }

    return response;
  } catch (error) {
    console.error("Cloudinary upload error:", error.message || error);


    if (fs.existsSync(localFilePath)) {
      try {
        fs.unlinkSync(localFilePath);
        console.log("Local file deleted after failed upload:", localFilePath);
      } catch (err) {
        console.error("Error deleting local file:", err.message || err);
      }
    }

    return null; 
    
  }
};

export { uploadOnCloudinary };
