import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";
import { generateRazorpayOrder, getOrders, getOrderById, verifyRazorpayPayment, getOrderListAdmin, updateOrderStatus, getTodayOrders } from "../controller/order.controller.js";

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
router.route('/order/today-orders').get(
    authMiddleware,
    getTodayOrders   
)


router.route('/order/today-orders').get(authMiddleware, (req, res) => {
    res.render('getTodayOrder'); 
});

router.route('/order/toggle-order/:orderId').post(
    authMiddleware,
    updateOrderStatus

)

export default router;