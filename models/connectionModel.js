// This file is initializing the mongodb connection
// and exporting it for use in all other files through the module.exports

const mysql = require('mysql');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const { dbHost, dbPort, dbUser, dbPassword, dbDatabase } = require('../config');

var options = {
    host: dbHost,
    port: dbPort,
    user: dbUser,
    password: dbPassword,
    database: dbDatabase,
    multipleStatements: true,
    connectionLimit: 100,
};

var connection = mysql.createConnection(options);

var del = connection._protocol._delegateError;
connection._protocol._delegateError = function(err, sequence){
  if (err.fatal) {
    console.trace('fatal error: ' + err.message);
  }
  return del.call(this, err, sequence);
};

var sessionStore = new MySQLStore({}, connection);

module.exports = sessionStore;

// const mongoose = require('mongoose');
// const databaseURL = 'mongodb://localhost:27017/qompete';

// const options = { useNewUrlParser: true,
//   useUnifiedTopology: true,
//   useFindAndModify: false };

// mongoose.connect(databaseURL, options);

// module.exports = mongoose;

