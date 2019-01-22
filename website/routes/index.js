var express = require("express");
var router = express.Router();
var Clips = require("../models").Clips;

/* GET home page. */
router.get("/", function(req, res, next) {
  Clips.findAll({
    limit: 25
  })
    .then(result => {
      res.render("index", {
        title: "Twitch Clip Contest",
        clips: result
      });
    })
    .catch(error => {
      res.render("error", {
        title: "Failed to render",
        error: error
      });
    });
});

module.exports = router;
