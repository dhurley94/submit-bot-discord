var express = require("express");
var router = express.Router();
var Clips = require("../models").Clips;

/* GET home page. */
router.get("/", function (req, res, next) {
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

module.exports = router;