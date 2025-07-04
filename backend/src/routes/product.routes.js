import { Router } from "express";
import { createProduct, getAllProduct, getProductsByCategory, updateProductById, deleteProductById, getProducts, getIndividualProduct, } from "../controller/product.controller.js";
import { authMiddleware } from "../middleware/auth.js";
import upload from "../middleware/multer.middleware.js";

import { mongoIdPathVariableValidator, validate } from "../utils/validation.js"; 
import { Product } from "../models/product.model.js";
import { Category } from "../models/category.model.js";
import { isValidObjectId } from "mongoose";

const router = Router()

router.route('/product-creation').post(
    
    upload.fields([
        {
          name: "mainImage",
          maxCount: 1,
        },
    ]),
    createProduct
)


// --------------------------------------------------------------Render the EJS template with data---------------------------------------

//    # Get all products
router.get('/products', async (req, res) => {
  const categories = await Category.find(); 
  const products = await Product.find() 
  res.render('products', { categories, products });
});

//     # Get products by Id
router.get('/:id', async (req, res, next) => {
  try {
    console.log("Request params:", req.params);
    const { id } = req.params;

    if (!id || !isValidObjectId(id)) {
      console.error("Invalid ID:", id);
      return res.status(400).send("Invalid product ID");
    }

    const product = await Product.findById(id).populate("category");
    console.log("Fetched product:", product);

    if (!product) {
      console.error("Product not found:", id);
      return res.status(404).send("Product not found");
    }

    const categories = await Category.find();
    res.render("productEdit", { product, categories });
  } catch (error) {
    console.error("Error fetching product:", error);
    next(error);
  }
});


router.route("/product/all-product").get(
    
    getAllProduct,
)

router.route('/item/:productId').get(
  
  getIndividualProduct
)

router.route("/product/get-products").get(
    
    getProducts,
)



  router.route('/product/:id').post(
      
      upload.single("mainImage"),
      updateProductById

  )

  

  router.route('/delete/:id').post(
    
    deleteProductById
  );


router .route("/category/:categoryId").get(mongoIdPathVariableValidator("categoryId"), validate, getProductsByCategory);



// Handle product creation

export default router