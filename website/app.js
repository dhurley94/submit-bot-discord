var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var logger = require("morgan");
var db = require("./models");
var Clips = require("./models").Clips;
var JSON = require("circular-json");

var app = express();

var session = require("express-session");
var passport = require("passport"),
  refresh = require("passport-oauth2-refresh");
var Strategy = require("./lib").Strategy;

passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

Users.belongsTo(Clips);
Clips.hasOne(Users);

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

app.use(
  session({
    secret: "537478675847970816",
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get("/login", passport.authenticate("discord", { scope: scopes }), function(
  req,
  res
) {});
app.get(
  "/auth/callback",
  passport.authenticate("discord", { failureRedirect: "/" }),
  function(req, res) {
    var data =
      res.socket.parser.socket.parser.socket.parser.socket._httpMessage.req
        .session.passport.user;
    Users.count({
      where: { profile_id: data.username }
    }).then(match => {
      if (match === 0) {
        Users.create({
          profile_id: data.username
        }).catch(err => {
          console.error(err);
        });
        res.redirect("/");
      } else {
        res.redirect("/");
      } // auth success
    });
  }
);
app.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});
app.get("/", checkAuth, function(req, res) {
  Clips.findAll({
    raw: true,
    limit: 25
  })
    .then(result => {
      res.render("index", {
        title: "Twitch Clip Contest",
        clips: result
      });
    })
    .catch(errors => {
      res.render("error", {
        title: "Failed to render",
        message: "Failed to render",
        error: errors
      });
    });
});

app.get("/upvote/", (req, res) => {
  res.redirect("http://localhost:3000", 301);
});

app.get("/upvote/:user_id", function(req, res) {
  Clips.findOne({
    where: {
      id: req.params.user_id
    }
  })
    .then(record => {
      record.update({
        reactions: (record.reactions += 1)
      });
      Users.findOne({
        where: { profile_id: record.username }
      }).then(result => {
        Users.update({
          ClipId: result.ClipId + " " + record.clip_url
        });
      });
    })
    .then(record => {
      res.redirect("/");
    });
});

function checkAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
}

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "twig");

app.set("twig options", {
  allow_async: true, // Allow asynchronous compiling
  strict_variables: false
});

app.use(logger("dev"));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false
  })
);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "production" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

db.sequelize.sync({
  force: false
});

module.exports = app;
