import express from "express";
import {
  createCategory,
  getCategoryForAdmin,
  getAllCategory,
  getProductsByCategory,
  updateCategory,
  deleteCategory,
} from "../controller/category.controller.js";
import { authMiddleware } from "../middleware/auth.js";
import { Category } from "../models/category.model.js";
import upload from "../middleware/multer.middleware.js";

const router = express.Router();

router.get("/category", async (req, res) => {
  const categories = await Category.find();
  res.render("category", { categories });
});

router.route("/create-category").post(
  upload.fields([
    {
      name: "image",
      maxCount: 1,
    },
  ]),

  createCategory
);

router.route("/get-categaory").get(getCategoryForAdmin);

router.route("/get-categories").get(getAllCategory);

router
  .route("/get-product-with-category/:categoryId")
  .get(getProductsByCategory);

router.route("/edit/:categoryId").post(updateCategory);

router.route("/delete/:categoryId").post(deleteCategory);

export default router;
