var express = require('express');
var router = express.Router();

//For Caching
var cache = require('memory-cache');
var conf = require('../conf/serverConf');
var key = 'AUTHENTICATE';


router.get('/', function(req, res, next) {
  // first check the cache.
  var html = cache.get(key);
  if (html) {
    //console.log('Found response in cache for authentication page');
    res.send(html);
    return;
  }

  res.render('authentication-layout.hbs', function (err, html) {
    if (!err) {
      cache.put(key, html, conf.PAGE_MAX_AGE);
    }
    res.send(html);
  });
});

module.exports = router;
