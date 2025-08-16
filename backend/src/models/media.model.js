import mongoose, { Schema } from "mongoose";

const mediaSchema = new Schema(
  {
    images: [
      {
        url: { type: String, required: true }, // Cloudinary URL
        alt: { type: String }, // optional alt text
        size: { type: Number }, // file size (bytes)
        format: { type: String }, // jpg, png, webp etc.
      },
    ],

    videos: [
      {
        url: { type: String, required: true },
        duration: { type: Number }, // in seconds
        format: { type: String }, // mp4, webm etc.
        thumbnail: { type: String }, // preview image
      },
    ],

    status: {
      type: String,
      enum: ["active", "archived", "deleted"],
      default: "active",
    },
  },
  { timestamps: true }
);

export const Media = mongoose.model("Media", mediaSchema);
