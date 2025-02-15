import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";
import { createAddress } from "../controller/address.controller.js";

const router = Router()

router.use(authMiddleware)

router.route('/create-address').post(
 createAddress   
)




export default router;