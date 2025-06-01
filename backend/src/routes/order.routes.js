import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";
import { generateRazorpayOrder, getOrders, getOrderById, verifyRazorpayPayment, getOrderListAdmin, updateOrderStatus } from "../controller/order.controller.js";

const router = Router()

router.use(authMiddleware)

router.route('/create-order').post(
    
    generateRazorpayOrder
)

router.route('/verify-payment').post(
    
    verifyRazorpayPayment
)

router.route('/order/get/:type?').get(
    
    getOrders
)



router.route('/get-order/:orderId').get(
    
    getOrderById
)

router.route('/order/get-order').get(
    
    getOrderListAdmin
)


router.route('/order/toggle-order/:orderId').post(
    
    updateOrderStatus

)

export default router;