import express from 'express';
import { createCategory,getCategoryForAdmin ,getCategory, getProductsByCategory, updateCategory, deleteCategory } from "../controller/category.controller.js"
import { authMiddleware } from '../middleware/auth.js';
import { Category } from '../models/category.model.js';

const router = express.Router();

router.get('/category', async (req, res) => {
    const categories = await Category.find(); 
    res.render('category', { categories });
  });

router.route("/create-category").post(authMiddleware, createCategory);


router.route('/get-categaory').get(getCategoryForAdmin); 

router.route('/get-categories').get(getCategory); 

router.route('/get-product-with-category/:categoryId').get(
  authMiddleware,
  getProductsByCategory
)

router.route('/edit/:categoryId').post(authMiddleware, updateCategory); 

router.route('/delete/:categoryId').post(authMiddleware, deleteCategory); 

export default router;
