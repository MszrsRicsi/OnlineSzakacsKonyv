require('dotenv').config({path: "../.env"});
const express = require('express');
const mysql = require('mysql');
const uuid = require('uuid');
const cors = require('cors');
const CryptoJS = require("crypto-js");
const moment = require('moment');

const app = express();
const passwdRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

let pool = mysql.createPool({
  connectionLimit : process.env.CONNECTIONLIMIT,
  host            : process.env.DBHOST,
  user            : process.env.DBUSER,
  password        : process.env.DBPASS,
  database        : process.env.DBNAME
});

app.get('/', (req, res) => {
  res.send(`MR + ME Backend`);
});

app.listen(process.env.PORT, () => {
  console.log(`Server is listening on port ${process.env.PORT}`);
});