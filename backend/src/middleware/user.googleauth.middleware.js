import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/User.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URI,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {

          user = await User.create({
            googleId: profile.id,
            userName: profile.displayName, 
            email: profile.emails?.[0]?.value || "No email provided",
            avatar: profile.photos?.[0]?.value || "No avatar available",
            isGoogleUser: true,
          });
        }

        done(null, user); 
      } catch (error) {
        console.error("Error in Google OAuth strategy:", error);
        done(error, null); 
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    console.error("Error deserializing user:", err);
    done(err, null);
  }
});

export default passport;
