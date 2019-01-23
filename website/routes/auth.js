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
      clientID: "537478675847970816",
      clientSecret: "1UD4vCMV6QLbPFkDNgZZNh567y-PL9tg",
      callbackURL: "http://localhost:3000/auth/callback",
      scope: scopes
    },
    function(accessToken, refreshToken, profile, done) {
      process.nextTick(function() {
        return done(null, profile);
      });
    }
  )
);

router.use(
  session({
    secret: "537478675847970816",
    resave: false,
    saveUninitialized: false
  })
);
router.use(passport.initialize());
router.use(passport.session());
router.get(
  "/login",
  passport.authenticate("discord", { scope: scopes }),
  function(req, res) {}
);
router.get(
  "/callback",
  passport.authenticate("discord", { failureRedirect: "/" }),
  function(req, res) {
    res.render("index", (res, req) => {});
  } // auth success
);
router.get("/logout", function(req, res) {
  req.logout();
  res.render("login", {
    message: "Login",
    msg: {
      status: "logged out",
      stack: "blah"
    }
  });
});
router.get("/info", checkAuth, function(req, res) {
  //console.log(req.user)
  res.json(req.user);
});

function checkAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.send("not logged in :(");
}

module.exports = router;
