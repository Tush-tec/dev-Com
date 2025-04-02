    import passport from "passport";
    import { Strategy as GoogleStrategy } from "passport-google-oauth20";
    import { User } from "../models/user.model.js";
    import jwt from "jsonwebtoken";
    import crypto from "crypto";
    import { asyncHandler } from "../utils/asyncHandler.js";
    import { generateAccessAndRefreshTokens } from "../controller/user.controller.js";
import { ApiError } from "../utils/ApiError.js";
//   import dotenv from "dotenv"
//     dotenv.config();  


    // Configure Google Strategy
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.CLIENT_ID,
                clientSecret:process.env.CLIENT_SECRET ,
                callbackURL: "http://localhost:8080/api/v1/users/auth/google/callback",
                scope: ['profile', 'email'], 
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    let user = await User.findOne({ googleId: profile.id });

                    // If user doesn't exist, create a new one
                    if (!user) {
                        const generatedPassword = crypto.randomBytes(16).toString("hex"); // Generate random password
                        // const username = profile.emails[0].value.split("@")[0]; // Use email prefix as username
                        // const avatar = profile.photos[0]?.value || "https://default-avatar-url.com/default.png"; // Default avatar
                        // const fullname = profile.displayName || "Google User"; // Fallback full name

                        // user = await User.create({
                        //     googleId: profile.id,
                        //   });
                        

                        user = await User.create({
                            googleId: profile.id,
                            userName: profile.displayName, 
                            fullname: profile.displayName,
                            email: profile.emails?.[0]?.value || "No email provided",
                            avatar: profile.photos?.[0]?.value || "No avatar available",
                            password: generatedPassword,
                            isGoogleUser: true,

                        });
                    }

                    // Generate JWT token
                    const token = jwt.sign(
                        {
                            userId: user._id
                        },
                        process.env.SECRET_KEY,
                        {
                            expiresIn: "1h" 
                        }
                    );

                    if (!token) {
                        return done(new Error("Failed to generate token"));
                    }

                    // Attach token to user
                    user.token = token;
                    console.log("user is logged in via google",token)

                    return done(null, user);
                } catch (error) {
                    console.error("Error in Google Strategy:", error); // Log error for debugging
                    return done(new Error("Failed to create or fetch user"));
                }
            }
        )
    );


    export const googleCallBack = asyncHandler(async (req, res, next) => {

        passport.authenticate("google", { failureRedirect: "/login" }, async (err, user, info) => {

            if (err) {
                console.error("Error during authentication:", err); 
                console.error("info", info)
               throw new ApiError(
                500,
                "Error during authentication" || err.message
                );
               
                
            }
            if (!user) {
                console.error("No user found:", info); 
                throw new  ApiError(
                    400,
                    "Authentication Failed Via Google!,  No user Found for Login.",
                )
            }

            // Generate Access and Refresh Tokens
            const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

            const options= {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            }

            // Respond with tokens and user data
            res
                .status(200)
                .cookie("accessToken", accessToken, options)
                .cookie("refreshToken", refreshToken, options)
                .json({
                    message: "User Authenticated Via Google",
                    user: user,
                    accessToken: accessToken,
                });
                // console.log(res)
        })(req, res, next);
    });

    passport.serializeUser((user, done) => {
        if (!user || !user._id) {
            return done(new Error("User object is invalid"), null);
        }
        done(null, user._id); 
    });
    
    
    passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        if (!user) {
            return done(new Error("User not found"), null);
        }
        done(null, user);
    } catch (err) {
        console.error("Error deserializing user:", err);
        done(err, null);
    }
});
    

  