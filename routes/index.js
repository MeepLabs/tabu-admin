var express = require('express');
var handlebars = require('express-handlebars');
var hbs = require('hbs');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('admin-layout.hbs', { title: 'Express' });
});

module.exports = router;
