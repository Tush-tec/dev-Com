import { Router } from "express";
import upload from "../middleware/multer.middleware.js";
import { authMiddleware } from "../middleware/auth.js";
import { registerUser,loginUser,loggedOutUser,refereshAccessToken,updateAccountDetails,updateUserAvatar,changeCurrentUserPassword } from "../controller/user.controller.js";


const router = Router()


router.route('/auth/register').post(
    upload.fields(
        [
            {
                name:"avatar",
                maxCount:1
            }
        ]
    ),
    registerUser
)

router.route('/auth/login').post(loginUser)
router.route('/auth/logout').post(
    authMiddleware,
    loggedOutUser
)

router.route('/update-account-details').patch(
    authMiddleware,
    updateAccountDetails
)

router.route('/update-avatar').patch(
    authMiddleware,
    upload.single("avatar"),
    updateUserAvatar
)

router.route('/auth/change-user-password').patch(
    authMiddleware,
    changeCurrentUserPassword
)
router.route('/auth/refresh-token').post(refereshAccessToken)

export default router