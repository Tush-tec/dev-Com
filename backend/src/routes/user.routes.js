import { Router } from "express";
import upload from "../middleware/multer.middleware.js";
import { authMiddleware } from "../middleware/auth.js";
import { registerUser,loginUser,loggedOutUser,updateAccountDetails,updateUserAvatar,changeCurrentUserPassword, updateUserRole } from "../controller/user.controller.js";
import passport from "passport";
import { asyncHandler } from "../utils/asyncHandler.js"; 
import { googleCallBack } from "../middleware/authGoggle.middleware.js";


const router = Router()


// ------------------------------------------User login Via Google --------------------------------------------------------------

router.route("/api/v1/users/auth/google").get(
    passport.authenticate("google", 
        {
            scope:[
                "profile",
                "email"
            ]
        }
    )
)

router.route("/auth/google/").get(
    asyncHandler(googleCallBack)
)

// ------------------------------------------User login Via Google --------------------------------------------------------------

// ----------------------------------------User With Jwt ---------------------------------------------------------------
router.route('/auth/register').post(
    upload.fields(
        [
            {
                name:"avatar",
                
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



export default router