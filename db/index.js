var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'tabu.cluster-ccklbzoiv5nj.us-east-1.rds.amazonaws.com',
  user     : 'EFrHPfERg7cZH2KU',
  password : 'wHA7T5LSLtzB2NbU',
  database : 'tabu_api'
});

module.exports = connection;
