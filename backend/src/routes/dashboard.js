import { Router } from "express";
import { dashBoardStats } from "../controller/dashboard.controller.js";
import { authMiddleware } from "../middleware/auth.js";



const router  = Router()


router.route('/dashboard').get(
    
    dashBoardStats
)


export default router;


