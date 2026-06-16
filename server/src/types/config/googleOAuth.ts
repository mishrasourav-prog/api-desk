import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../../models/user.model";


passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    },
    async (_accessToken, _refreshToken, profile, done) => {

      try {

         let user = await User.findOne({
  email: profile.emails?.[0].value
});

        if (!user) {
  user = await User.create({
    name: profile.displayName,

    username:
      profile.displayName
        .replace(/\s+/g, "_")
        .toLowerCase() +
      "_" +
      Math.floor(Math.random() * 10000),

    email: profile.emails?.[0].value,

    googleId: profile.id,

    avatar: profile.photos?.[0]?.value
  });
}

        done(null, user);

      } catch (error) {
        done(error as Error, undefined);
      }
    }
  )
);