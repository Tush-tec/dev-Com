import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config(); // Load .env variables

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload Function
const uploadOnCloudinary = async (localFilePath) => {
  if (!localFilePath) {
    console.error("No file path provided for upload.");
    return null;
  }

  try {
    // Upload file to Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto", // Handles images, videos, etc.
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

    // Cleanup local file if the upload fails
    if (fs.existsSync(localFilePath)) {
      try {
        fs.unlinkSync(localFilePath);
        console.log("Local file deleted after failed upload:", localFilePath);
      } catch (err) {
        console.error("Error deleting local file:", err.message || err);
      }
    }

    return null; // Return null on failure
  }
};

export { uploadOnCloudinary };
