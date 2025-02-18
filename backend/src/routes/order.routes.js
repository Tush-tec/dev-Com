import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";
import { generateRazorpayOrder, verifyRazorpayPayment } from "../controller/order.controller.js";

const router = Router()

router.use(authMiddleware)

router.route('/create-order').post(generateRazorpayOrder)
router.route('/verify-payment').post(verifyRazorpayPayment)


export default router;