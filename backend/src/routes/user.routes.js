import { Router } from "express";
import upload from "../middleware/multer.middleware.js";
import { authMiddleware } from "../middleware/auth.js";
import { registerUser,loginUser,loggedOutUser,updateAccountDetails,updateUserAvatar,changeCurrentUserPassword, getUser, getIndividualUser } from "../controller/user.controller.js";
import passport from "passport";
import { asyncHandler } from "../utils/asyncHandler.js"; 
import { googleCallBack } from "../middleware/authGoggle.middleware.js";


const router = Router()


// ------------------------------------------User login Via Google --------------------------------------------------------------

router.get(
    "/auth/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
        session: false, // Ensures JWT usage instead of sessions
    })
);


router.get(
    "/auth/google/callback",
    passport.authenticate("google", {
        failureRedirect: "/login", 
        session: false, 
    }),
    googleCallBack 
);



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

router.route('/account-details').get(
    authMiddleware,
    getUser
)

router.route('/auth/logout').post(
    authMiddleware,
    loggedOutUser
)

router.route('/user/:id').get(
    authMiddleware,
    getIndividualUser
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