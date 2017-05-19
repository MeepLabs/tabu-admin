var $ = require('jquery-deferred');
var cache = require('memory-cache');
var conf = require('../conf/serverConf');
var db = require('../db/')

var globalMethods = {
	res: false,
	cacheEnabled: false,
	setRes: function(mResult) {
		this.res = mResult;
	},
	setCache: function(shouldCache) {
		this.cacheEnabled = shouldCache;
	},
	getGeneralStats: function(callback) {
		var deferred = $.Deferred();
		deferred.resolveWith(deferred, {avg_tip: 212.29, avg_tip_pct: 18.2, avg_tab: 16.74, tab_total: 1875.16, tip_total: 237.77});
		
		
		deferred.done(callback);
		return deferred.promise();
	},
	getGlobalStats: function(callback) {
		var query = "SELECT * FROM ("
		query += "(SELECT ROUND(AVG(tip) * 100, 2) avg_tip FROM tab_payments WHERE subtotal <> 0 AND subtotal IS NOT NULL)a,"
		query += "(SELECT ROUND(AVG(tip/subtotal) * 100, 2) avg_tip_pct FROM tab_payments WHERE subtotal <> 0 AND subtotal IS NOT NULL) e,"
		query += "(SELECT ROUND(AVG(subtotal), 2) avg_tab FROM tab_payments WHERE subtotal <> 0 AND subtotal IS NOT NULL) b,"
		query += "(SELECT ROUND(SUM(subtotal), 2) tab_total FROM tab_payments WHERE subtotal <> 0 AND subtotal IS NOT NULL) c,"
		query += "(SELECT ROUND(SUM(tip), 2) tip_total FROM tab_payments WHERE subtotal <> 0 AND subtotal IS NOT NULL) d"
		query += ")";
		var deferred = this.query(query, callback);
		return deferred.promise();
	},
    query: function(queryString, callback, shouldCache) {
		shouldCache = (undefined === shouldCache) ? this.cacheEnabled : shouldCache;
		var deferred = $.Deferred();
		deferred.done(callback);

		var cacheResult;
        if (shouldCache) {
			cacheResult = cache.get(queryString);
			if (cacheResult) {
				return deferred.resolveWith(deferred, [cacheResult.rows, cacheResult.fields]).promise();
			}
		}
		
		db.query(queryString, function (err, rows, fields) {
			if (!err) {
				if (shouldCache) {
					cache.put(queryString, {
						rows: rows,
						fields: fields
					}, conf.PAGE_MAX_AGE);
				}
				deferred.resolveWith(deferred, [rows, fields]);
			} else {
				deferred.rejectWith(deferred, [err]);
			}
		});
		return deferred.promise();
	},
	round: function (value, exp) {
		if (typeof exp === 'undefined' || +exp === 0)
			return Math.round(value);

		value = +value;
		exp = +exp;

		if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0))
			return NaN;

		// Shift
		value = value.toString().split('e');
		value = Math.round(+(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp)));

		// Shift back
		value = value.toString().split('e');
		return +(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp));
	}

}

module.exports = globalMethods;
