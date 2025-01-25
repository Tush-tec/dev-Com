import { Router } from "express";
import upload from "../middleware/multer.middleware.js";
import { authMiddleware } from "../middleware/auth.js";
import {
  registerUser,
  loginUser,
  loggedOutUser,
  updateAccountDetails,
  updateUserAvatar,
  changeCurrentUserPassword,
} from "../controller/admin.controller.js";
import passport from "passport";
import { asyncHandler } from "../utils/asyncHandler.js";
import { googleCallBack } from "../middleware/authGoggle.middleware.js";

const router = Router();

// ------------------------------------------User login Via Google--------------------------------------------------------------
router.route("/api/v1/users/auth/google").get(
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.route("/auth/google/").get(asyncHandler(googleCallBack));

// ------------------------------------------============================================--------------------------------------------------------------

router
  .route("/auth/register")
  .get((req, res) => {
    res.render("register");
  })
  .post(
    upload.fields([{ name: "avatar" }]),
    asyncHandler(registerUser),
    (req, res) => {
      res.redirect("/api/v1/admin/auth/register");
    }
);



router
  .route('/auth/login')
  .get((req, res) => {
    res.render('login');
  })
  .post(asyncHandler(loginUser));

router.route("/dashboard").get(authMiddleware, (req, res) => {
  res.render("dashboard");
});






router
  .route("/auth/logout")
  .post(authMiddleware, asyncHandler(loggedOutUser), (req, res) => {
    res.render("login");
  });

router
  .route("/update-account-details")
  .patch(authMiddleware, asyncHandler(updateAccountDetails), (req, res) => {
    res.json({ message: "Account details updated successfully" });
  });

router.route("/update-avatar").patch(
  authMiddleware,
  upload.single("avatar"),
  asyncHandler(updateUserAvatar), // Handle avatar update
  (req, res) => {
    res.json({ message: "Avatar updated successfully" });
  }
);

router.route("/auth/change-user-password").patch(
  authMiddleware,
  asyncHandler(changeCurrentUserPassword), // Handle password change
  (req, res) => {
    res.json({ message: "Password changed successfully" });
  }
);

export default router;
