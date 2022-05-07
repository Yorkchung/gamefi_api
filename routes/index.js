var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '40e4b17fc61f0cd3221a3f50ca836750248bf60a8281adf156af0d49892de838' });
});

module.exports = router;
