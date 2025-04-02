import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError";



passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URI,
      passReqToCallback: true
    },
    async (request, accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {

          user = await User.create({
            googleId: profile.id,
            userName: profile.displayName, 
            fullname: profile.displayName,
            email: profile.emails?.[0]?.value || "No email provided",
            avatar: profile.photos?.[0]?.value || "No avatar available",
            isGoogleUser: true,
          });
        }

        return done(null, user); 
      } catch (error) {
        console.error("Error in Google OAuth strategy:", error);
        done(error, null); 
      }
    }
  )
);

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

export default passport;
