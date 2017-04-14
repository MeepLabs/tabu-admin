var mysql      = require('mysql');

var dataSource = '';
var userId = '';
var password = '';
var database = '';

const connStr = process.env.MYSQLCONNSTR_awsConnection;
if(connStr) {
  const connArr = connStr.split(';');
  const connExtended = connArr.map(str => str.split('='))
  database = connExtended[0][1];
  dataSource = connExtended[1][1];
  userId = connExtended[2][1];
  password = connExtended[3][1];
}

var connection = mysql.createConnection({
 host     : dataSource,
 user     : userId,
 password : password,
 database : database
});

module.exports = connection;
