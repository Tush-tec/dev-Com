import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";
import { addToCart, getCart, removeFromCart, updateCartItems, clearCart } from "../controller/cart.controller.js";
import { mongoIdPathVariableValidator, validate } from "../utils/validation.js"; 
// import { verifyPermission } from "../middleware/auth.js"; 

const router = Router()

router.route('/add-to-cart/:productId').post(
    authMiddleware,
    mongoIdPathVariableValidator("productId"),
    validate,
    addToCart

)

router.post('/add-to-cart', authMiddleware, addToCart)
router.get('/get-cart', authMiddleware, getCart)
router.post('/remove-from-cart', authMiddleware, removeFromCart)
router.post('/clear-cart', authMiddleware, clearCart)
router.post('/update-cart', authMiddleware, updateCartItems)


export default router;