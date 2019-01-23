var express = require("express");
var router = express.Router();
var Clips = require("../models").Clips;
var User = require("../models").User;
var session = require("express-session");
var passport = require("passport");
var Strategy = require("../lib").Strategy;

var scopes = ["identify", "email"];

passport.use(
  new Strategy(
    {
      clientID: "",
      clientSecret: "",
      callbackURL: "http://localhost:5000/callback",
      scope: scopes
    },
    function(accessToken, refreshToken, profile, done) {
      process.nextTick(function() {
        return done(null, profile);
      });
    }
  )
);

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());
router.get("/", passport.authenticate("discord", { scope: scopes }), function(
  req,
  res
) {});
app.get(
  "/callback",
  passport.authenticate("discord", { failureRedirect: "/" }),
  function(req, res) {
    res.redirect("/info");
  } // auth success
);
app.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});
app.get("/info", checkAuth, function(req, res) {
  //console.log(req.user)
  res.json(req.user);
});

function checkAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.send("not logged in :(");
}

module.exports = router;
