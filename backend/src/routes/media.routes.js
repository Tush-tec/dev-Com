import { Router } from "express";
import upload from "../middleware/multer.middleware.js";
import { createMedia } from "../controller/media.controller.js";

const router = Router();

router.route("/create-media").post(
  upload.fields([
    {
      name: "images",
      maxCount: 10,
    },
    {
      name: "videos",
      maxCount: 2,
    },
  ]),

  createMedia
);

export default router;
