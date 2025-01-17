import { Router } from "express";
import { createProduct, getAllProduct, getProductById, getProductsByCategory, updateProductById, deleteProductById, } from "../controller/product.controller.js";
import { authMiddleware } from "../middleware/auth.js";
import upload from "../middleware/multer.middleware.js";
import { UserRolesEnum } from "../constant.js";
import { createProductValidator,updateProductValidator } from "../utils/extraValidation/product.validation.js";
import { mongoIdPathVariableValidator, validate } from "../utils/validation.js"; 
import { verifyPermission } from "../middleware/auth.js";   

const router = Router()

// .get(getAllProduct)
router.route('/product-creation').post(
    authMiddleware,
    upload.fields([
        {
          name: "mainImage",
          maxCount: 1,
        },
    ]),
    createProduct
)

router.route("/product/all-product").get(
    authMiddleware,
    getAllProduct
)
router.route('/product/update/:productId').get(getProductById)
.patch(
    authMiddleware,
    verifyPermission([UserRolesEnum.ADMIN]),
    upload.fields(
        [
            {
                name:"image",
                maxCount:1
            }
        ]
    ),
    mongoIdPathVariableValidator("productId"),
    updateProductValidator(),
    validate,
    updateProductById    
)
.delete(
    authMiddleware,
    verifyPermission([UserRolesEnum.ADMIN]),
    mongoIdPathVariableValidator("productId"),
    validate,
    deleteProductById
);

router
  .route("/category/:categoryId")
  .get(mongoIdPathVariableValidator("categoryId"), validate, getProductsByCategory);

export default router