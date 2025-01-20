import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { User } from "../models/user.model.js";

passport.serializeUser((user, done) => {
    done(null, user.id); 
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id); 
        done(null, user); 
    } catch (error) {
        done(error, null);
    }
});



passport.use(new LocalStrategy(
    async (username, password, done) => {
        try {
            const user = await User.findOne({ username });
            if (!user) return done(null, false, { message: "User not found" });
            const isValidPassword = await user.verifyPassword(password);
            if (!isValidPassword) return done(null, false, { message: "Incorrect password" });
            return done(null, user);
        } catch (error) {
            console.error(error.message || error)
            return done(error);
        }
    }
));

export default passport;
