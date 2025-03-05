import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";
import { createAddress, deleteAddressById, getAddressById } from "../controller/address.controller.js";

const router = Router()

router.use(authMiddleware)

router.route('/create-address').post(
 createAddress   
)

router.route('/get-address/:addressId').get(
    authMiddleware,
    getAddressById
)

router.route('/delete-address/:addressId').get(
    authMiddleware,
    deleteAddressById
)



export default router;