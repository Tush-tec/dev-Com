    import passport from "passport";
    import { Strategy as GoogleStrategy } from "passport-google-oauth20";
    import { User } from "../models/user.model.js";
    import jwt from "jsonwebtoken";
    import crypto from "crypto";
    import { asyncHandler } from "../utils/asyncHandler.js";
    import { generateAccessAndRefreshTokens } from "../controller/user.controller.js";
//   import dotenv from "dotenv"
//     dotenv.config();  


    // Configure Google Strategy
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.CLIENT_ID,
                clientSecret:process.env.CLIENT_SECRET ,
                callbackURL: "http://localhost:8080/api/v1/users/auth/google",
                scope: ['profile', 'email'], 
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    let user = await User.findOne({ googleId: profile.id });

                    // If user doesn't exist, create a new one
                    if (!user) {
                        const generatedPassword = crypto.randomBytes(16).toString("hex"); // Generate random password
                        const username = profile.emails[0].value.split("@")[0]; // Use email prefix as username
                        const avatar = profile.photos[0]?.value || "https://default-avatar-url.com/default.png"; // Default avatar
                        const fullname = profile.displayName || "Google User"; // Fallback full name

                        user = await User.create({
                            googleId: profile.id,
                            email: profile.emails[0].value,
                            fullname: fullname,
                            username: username,
                            avatar: avatar,
                            password: generatedPassword,
                        });
                    }

                    // Generate JWT token
                    const token = jwt.sign(
                        { userId: user._id },
                        process.env.SECRET_KEY,
                        { expiresIn: "1h" }
                    );

                    if (!token) {
                        return done(new Error("Failed to generate token"));
                    }

                    // Attach token to user
                    user.token = token;
                    console.log(token)

                    return done(null, user);
                } catch (error) {
                    console.error("Error in Google Strategy:", error); // Log error for debugging
                    return done(new Error("Failed to create or fetch user"));
                }
            }
        )
    );

    // Google Authentication Callback Handler
    export const googleCallBack = asyncHandler(async (req, res, next) => {

        passport.authenticate("google", { failureRedirect: "/login" }, async (err, user, info) => {
            if (err) {
                console.error("Error during authentication:", err); // Log error details
                console.error("info", info)
                return res.status(400).json({ message: "Authentication Failed Via Google!", error: err });
                
            }
            if (!user) {
                console.error("No user found:", info); // Log additional info from passport
                return res.status(400).json({ message: "Authentication Failed Via Google!" });
            }

            // Generate Access and Refresh Tokens
            const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

            // Respond with tokens and user data
            res
                .status(200)
                .cookie("accessToken", accessToken)
                .cookie("refreshToken", refreshToken)
                .json({
                    message: "User Authenticated Via Google",
                    user: user,
                    accessToken: accessToken,
                });
                // console.log(res)
        })(req, res, next);
    });

  