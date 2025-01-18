import { Router } from "express";
import { createProduct, getAllProduct, getProductById, getProductsByCategory, updateProductById, deleteProductById, } from "../controller/product.controller.js";
import { authMiddleware } from "../middleware/auth.js";
import upload from "../middleware/multer.middleware.js";
import { UserRolesEnum } from "../constant.js";
import { createProductValidator,updateProductValidator } from "../utils/extraValidation/product.validation.js";
import { mongoIdPathVariableValidator, validate } from "../utils/validation.js"; 
import { verifyPermission } from "../middleware/auth.js";   
import { Product } from "../models/product.model.js";
import { Category } from "../models/category.model.js";

const router = Router()

// .get(getAllProduct)
router.route('/product-creation').post(
    // authMiddleware,
    upload.fields([
        {
          name: "mainImage",
          maxCount: 1,
        },
    ]),
    createProduct
)

// Render the EJS template with data
router.get('/products', async (req, res) => {
  const categories = await Category.find(); 
  const products = await Product.find() 
  res.render('products', { categories, products });
});

router.route("/product/all-product").get(
    authMiddleware,
    getAllProduct
)




router
  .route('/product/:productId')
  .get(getProductById)
  .patch(
    authMiddleware,
    verifyPermission([UserRolesEnum.ADMIN]),
    upload.fields([
      {
        name: "image",
        maxCount: 1,
      },
    ]),
    mongoIdPathVariableValidator("productId"),
    updateProductValidator(),
    validate,
    updateProductById
  )
  .delete(
    authMiddleware,
    verifyPermission([UserRolesEnum.USER]),
    mongoIdPathVariableValidator("productId"),
    validate,
    deleteProductById
  );

router .route("/category/:categoryId").get(mongoIdPathVariableValidator("categoryId"), validate, getProductsByCategory);



// Handle product creation

export default router