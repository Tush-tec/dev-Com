import { v2 as cloudinary } from "cloudinary";
import sharp from "sharp";
import fs from "fs/promises";
import fsSync from "fs";  
import path from "path";
import os from "os";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {

  if (!localFilePath) return null;

  const tempDir = process.env.NODE_ENV === 'production' ? '/tmp' : os.tmpdir();

  // ✅ Ensure the /tmp folder exists (especially for Vercel)
  if (!fsSync.existsSync(tempDir)) {
    await fs.mkdir(tempDir, { recursive: true });
  }

  const compressedPath = path.join(tempDir, `compressed_${Date.now()}.jpg`);

  try {
    await sharp(localFilePath)
      .resize({ width: 1080 })
      .jpeg({ quality: 75 })
      .toFile(compressedPath);

    const response = await cloudinary.uploader.upload(compressedPath, {
      resource_type: "image",
      folder: "optimized_images",
      fetch_format: "auto",
    });

    console.log("✅ File uploaded to Cloudinary:", response.url);

    await Promise.all(
      [localFilePath, compressedPath].map(async (file) => {
        try {
          await fs.unlink(file);
          console.log("Local file deleted:", file);
        } catch (err) {
          console.warn(`Failed to delete file: ${file}`, err.message);
        }
      })
    );

    return response;
  } catch (error) {
    console.error("Cloudinary upload error:", error.message || error);

    await Promise.all(
      [localFilePath, compressedPath].map(async (file) => {
        try {
          await fs.unlink(file);
        } catch {}
      })
    );

    return null;
  }
};

export { uploadOnCloudinary };
