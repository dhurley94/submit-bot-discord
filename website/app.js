var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var db = require("./models");
var Clips = require("./models").Clips;

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var Twig = require("twig"), // Twig module
  twig = Twig.twig; // Render function

var app = express();

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

app.use("/", indexRouter);

app.get("/upvote/:user_id", function (req, res, next) {
  Clips.findOne({
    where: {
      id: req.params.user_id
    }})
    .then(record => {
      record.update({
        reactions: record.reactions += 1
      });
    })
    .then(record => {
      res.redirect("/");
    });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "production" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

const getClientAddress = function (req) {
  return (req.headers['x-forwarded-for'] || '').split(',')[0] 
  || req.connection.remoteAddress;
};


db.sequelize.sync({
  force: false
});

module.exports = app;