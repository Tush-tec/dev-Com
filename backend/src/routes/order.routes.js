import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";
import { generateRazorpayOrder, getOrders, getOrderById, verifyRazorpayPayment, getOrderListAdmin, updateOrderStatus } from "../controller/order.controller.js";

const router = Router()

router.use(authMiddleware)

router.route('/create-order').post(
    authMiddleware,
    generateRazorpayOrder
)

router.route('/verify-payment').post(
    authMiddleware,
    verifyRazorpayPayment
)

router.route('/order/get/:type?').get(
    authMiddleware,
    getOrders
)



router.route('/get-order/:orderId').get(
    authMiddleware,
    getOrderById
)

router.route('/order/get-order').get(
    authMiddleware,
    getOrderListAdmin
)


router.route('/order/toggle-order/:orderId').post(
    authMiddleware,
    updateOrderStatus

)

export default router;