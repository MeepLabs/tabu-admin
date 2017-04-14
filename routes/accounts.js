var express = require('express');
var handlebars = require('express-handlebars');
var hbs = require('hbs');
const db = require('../db/');
var router = express.Router();

//For Caching
var cache = require('memory-cache');
var conf = require('../conf/serverConf');
var category = 'ACCOUNTS';

function render(res, counts) {
    var total = 0;
    for (var i in counts) {
        total += counts[i];
    }
    res.render('admin-layout.hbs', {
        title: "Accounts",
        counts: JSON.stringify(counts),
        goals: JSON.stringify([600, 400, 200, 100, 75, 60, 30, 0, 0, 0, 0, 0]),
        total: total,
        icon: "icon-linecons-user"
    });
}

/* GET home page. */
router.get('/', function (req, res, next) {
    var completed = 0;
    var counts = [];
    var shouldCache = conf.CACHED_QUERIES[category] == true;
    for (count = 0; count < 12; count++) {
        var now = new Date();
        var endOfMonth = new Date(now.getFullYear(), now.getMonth() + 3 - count) / 1000;
        var startOfMonth = new Date(now.getFullYear(), now.getMonth() + 2 - count) / 1000;
        var query = `SELECT COUNT(*) from users WHERE created_at > ${startOfMonth} AND created_at < ${endOfMonth}`;

        // Check whether this query is cachable. If result is present in cache then continue with the loop
        if (shouldCache && cache.get(query)) {
            processQueryResult(cache.get(query).rows);
        } else {
            queryDBAndCache(query);
        }

        // Create below functions as closure because loop will run for all the index at once so need to make the variables local to the function.
        function processQueryResult(rows) {
            counts.push(rows[0]["COUNT(*)"]);
            if (counts.length >= 12) {
                render(res, counts);
            }
        }

        function queryDBAndCache(queryString) {
            db.query(queryString, function (err, rows, fields) {
                if (!err) {
                    if (shouldCache) {
                        cache.put(queryString, {
                            rows: rows,
                            fields: fields
                        }, conf.PAGE_MAX_AGE);
                    }
                    processQueryResult(rows);
                } else {
                    res.send('Error while performing Query.', err);
                }
            });
        }
    }
});




module.exports = router;
