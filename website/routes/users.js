var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/:user_id', function(req, res, next) {
  console.log(req.params)
  res.send('respond with a resource');
});

module.exports = router;
