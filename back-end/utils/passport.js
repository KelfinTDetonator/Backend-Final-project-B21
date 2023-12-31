const pasport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { PrismaClient } = require("@prisma/client");
const passport = require("passport");

const prisma = new PrismaClient();

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL } = process.env;

pasport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: GOOGLE_CALLBACK_URL,
    },
    (async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await prisma.user.upsert({
          where: { email: profile.emails[0].value },
          update: { googleID: profile.id },
          create: {
            email: profile.emails[0].value,
            googleID: profile.id,
            verified: profile.emails[0].verified,
            profile: {
              create: {
                name: profile.displayName,
                profile_picture: profile.photos[0].value,
              },
            },
          },
        });
        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }),
  ),
);

module.exports = passport;
