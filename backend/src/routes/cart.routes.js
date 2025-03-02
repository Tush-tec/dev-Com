import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";
import { addToCart, getCart, removeFromCart, updateCartItems, clearCart, addMultipleToCart } from "../controller/cart.controller.js";



const router = Router()

router.route("/add-multiple-product").post(
    authMiddleware,
    addMultipleToCart
)

router.route('/add-to-cart/:productId').post(
    authMiddleware,
    addToCart

)

router.post('/add-to-cart', addToCart)
router.get('/get-cart', authMiddleware, getCart)
router.delete('/remove-from-cart/:productId', authMiddleware, removeFromCart)
router.post('/clear-cart', authMiddleware, clearCart)
router.post('/update-cart', authMiddleware, updateCartItems)


export default router;