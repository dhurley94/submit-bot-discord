var express = require("express");
var router = express.Router();
var Clips = require("../models").Clips;
var User = require("../models").User;

router.get("/", (req, res) => {
  res.redirect("http://localhost:3000", 301);
});

router.get("/:user_id", function(req, res) {
  Clips.findOne({
    where: {
      id: req.params.user_id
    }
  })
    .then(record => {
      record.update({
        reactions: (record.reactions += 1)
      });
    })
    .then(record => {
      res.redirect("/");
    });
});

module.exports = router;
