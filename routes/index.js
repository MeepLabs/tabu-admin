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
  res.render('admin-layout.hbs', { title: "Tabs Closed",
  counts: JSON.stringify(counts),
  goals: JSON.stringify([0,0,0,0,0,0,0,0,0,0,0,0]),
  total: total });
}

/* GET home page. */
router.get('/', function(req, res, next) {
  var completed = 0;
  var counts = [];
  for(count = 0; count < 12; count++){
    var now = new Date();
    var endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1 - count)  / 1000;;
    var startOfMonth = new Date(now.getFullYear(), now.getMonth() - count) / 1000;
    db.query(`SELECT COUNT(*) from tab_payments WHERE created_at > ${startOfMonth} AND created_at < ${endOfMonth}`, function(err, rows, fields) {
      if (!err) {
        counts.push(rows[0]["COUNT(*)"]);
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
