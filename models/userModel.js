var mysql = require('./connectionModel');
mysql = mysql.connection;

exports.addUserScore = function(query, update, next) {
  var sql = "update users set score = score + ? where ?";
  sql = mysql.format(sql, update);
  sql = mysql.format(sql, query);
  console.log(sql);
  mysql.query(sql, next);
}

exports.getUser = function(query, next) {
  var sql = "select * from users where ?";
  sql = mysql.format(sql, query);
  mysql.query(sql, next);
}