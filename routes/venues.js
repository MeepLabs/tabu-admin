var express = require('express');
var handlebars = require('express-handlebars');
var hbs = require('hbs');
var router = express.Router();

var conf = require('../conf/serverConf');

var $ = require('jquery-deferred');
var $g = require('../global/');
var category = 'VENUES';



/* GET home page. */
router.get('/', function (req, res, next) {
    var completed = 0;
    var counts = [];
	var globalStats = null;
	var generalStats = null;
	var defStack = [];

    var shouldCache = conf.CACHED_QUERIES[category] == true;
	$g.setRes(res);
	$g.setCache(shouldCache);

	function countCallback(rows) {
        counts.push(rows[0]["total"]);
	}

    for (count = 0; count < 12; count++) {
        var now = new Date();
        var endOfMonth = new Date(now.getFullYear(), now.getMonth() + 3 - count) / 1000;
        var startOfMonth = new Date(now.getFullYear(), now.getMonth() + 2 - count) / 1000;
        var query = `SELECT COUNT(*) total from venues WHERE created_at > ${startOfMonth} AND created_at < ${endOfMonth}`;

		defStack.push($g.query(query, countCallback)); //add to promise stack
	}

	defStack.push($g.getGeneralStats(function (obj) {
		generalStats = obj;
	}));
	defStack.push($g.getGlobalStats(function (obj) {
		globalStats = obj;
	}));

	$.when.apply($, defStack).then(function() {
		var total = 0;
		for (var i in counts) {
			total += counts[i];
		}
		res.render('admin-layout.hbs', {
			title: "Venues",
			globalStats: JSON.stringify(globalStats),
			generalStats: JSON.stringify(generalStats),
			counts: JSON.stringify(counts),
			goals: JSON.stringify([25, 20, 10, 6, 0, 0, 0, 0, 0, 0, 0, 0]),
			total: total,
			icon: "icon-linecons-money"
		});
	}).fail(function(err) {
		res.send(err);
	});
});

module.exports = router;
