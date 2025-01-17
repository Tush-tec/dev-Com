import express from 'express';
import { createCategory, getCategory, getCategoryById, updateCategory, deleteCategory } from "../controller/category.controller.js"
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Route to create a category
router.route('/create-category').post(authMiddleware, createCategory); 

// Route to get all categories with pagination
router.route('/get-categaory').get(getCategory); 

// Route to get a category by ID
router.route('/:categoryId').get(getCategoryById);

// Route to update a category by ID
router.route('/:categoryId').put(authMiddleware, updateCategory); // Assuming protect middleware for authentication

// Route to delete a category by ID
router.route('/:categoryId').delete(authMiddleware, deleteCategory); // Assuming protect middleware for authentication

export default router;
