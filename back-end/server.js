'use strict';

// load package
const express = require('express');
const mysql = require('mysql')

const PORT = 8080;
const HOST = '0.0.0.0';
const app = express();

// create connection to mysql

// var connection = mysql.createConnection({
//   host     : 'mysql',
//   user     : 'root',
//   password : 'CMPT371-Team1'
// });
 
// connection.connect();
   
// app.listen(PORT, HOST);

// console.log('up and running');


// Create a connection pool to mysql
const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'mysql',
  user: 'root',
  password: 'CMPT371-Team1'
});

// Use middleware to add the pool to every request
app.use((req, res, next) => {
  req.mysqlPool = pool;
  next();
});

app.listen(PORT, HOST, () => {
  console.log('up and running');
});