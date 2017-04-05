var express = require('express');
var handlebars = require('express-handlebars');
var hbs = require('hbs');
const db = require('../db/')
var router = express.Router();

function render(res, counts) {
  var total = 0;
  for (var i in counts) {
    total += counts[i];
  }
  res.render('admin-layout.hbs', { title: "Venues",
  counts: JSON.stringify(counts),
  goals: JSON.stringify([20,10,6,0,0,0,0,0,0,0,0,0]),
  total: total,
  icon: "icon-linecons-money"});
}

/* GET home page. */
router.get('/', function(req, res, next) {
  var completed = 0;
  var counts = [];
  for(count = 0; count < 12; count++){
    var now = new Date();
    var endOfMonth = new Date(now.getFullYear(), now.getMonth() + 3 - count)  / 1000;;
    var startOfMonth = new Date(now.getFullYear(), now.getMonth() + 2 - count) / 1000;
    db.query(`SELECT COUNT(*) from venues WHERE created_at > ${startOfMonth} AND created_at < ${endOfMonth}`, function(err, rows, fields) {
      if (!err) {
        counts.push(Math.round(rows[0]["COUNT(*)"] * 100)/100);
        if (counts.length >= 12) {
          render(res, counts);
        }
      } else {
        res.send('Error while performing Query.', err);
      }
    });
  }
});

module.exports = router;
