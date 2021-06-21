const passport = require("passport"),
  FacebookStrategy = require("passport-facebook").Strategy,
  GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (user, done) {
  done(null, user);
});

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.fb_app_id,
      clientSecret: process.env.fb_app_secret,
      callbackURL: process.env.fb_app_redirect_uri,
      profileFields: ["name", "email", "picture.type(large)"]
    },
    function (accessToken, refreshToken, profile, done) {
      //console.log(accessToken, refreshToken, profile);
      const { email, picture, id, first_name, last_name } = profile._json;
      //console.log(picture.data.url);
      return done(null, true);
      /*User.findOrCreate({ facebookId: profile.id }, function (error, user) {
        return done(error, user);
      });*/
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.google_consumer_key,
      clientSecret: process.env.google_consumer_secret,
      callbackURL: process.env.google_redirect_uri
    },
    function (token, tokenSecret, profile, done) {
      //console.log(token, tokenSecret, profile);
      return done(null, profile);
    }
  )
);
