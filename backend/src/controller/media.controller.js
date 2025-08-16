import { Media } from "../models/media.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const createMedia = asyncHandler(async (req, res) => {
  const { status } = req.body;

  // normalize empty arrays
  const imageFiles = req.files?.images || [];
  const videoFiles = req.files?.videos || [];

  if (!imageFiles.length && !videoFiles.length) {
    throw new ApiError(400, "Please upload at least one image or video");
  }

  // Upload images
  const uploadedImages = await Promise.all(
    imageFiles.map(async (file) => {
      const result = await uploadOnCloudinary(file.path, "image");
      if (!result)
        throw new ApiError(400, "Failed to upload image to Cloudinary");

      return {
        url: result.secure_url,
        size: result.bytes,
        format: result.format,
        alt: req.body.alt || "", // optional
      };
    })
  );

  // Upload videos
  const uploadedVideos = await Promise.all(
    videoFiles.map(async (file) => {
      const result = await uploadOnCloudinary(file.path, "video");
      if (!result)
        throw new ApiError(400, "Failed to upload video to Cloudinary");

      return {
        url: result.secure_url,
        duration: result.duration, // Cloudinary gives duration for videos
        format: result.format,
        thumbnail: result.thumbnail_url || "",
      };
    })
  );

  // Save in DB
  const SaveInDB = await Media.create({
    images: uploadedImages,
    videos: uploadedVideos,
    status,
  });

  if (!SaveInDB) {
    throw new ApiError(500, "Failed to save media to database");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, SaveInDB, "Media created successfully"));
});

export { createMedia };
