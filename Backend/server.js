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

//user registration
app.post('/reg', (req, res) => {
  
  if (!req.body.name || !req.body.email || !req.body.passwd || !req.body.confirm) {
    res.status(203).send('You did not provide all the required information!');
    return;
  }

  if (req.body.passwd != req.body.confirm) {
    res.status(203).send('Passwords are not matching!');
    return;
  }

  if (!req.body.passwd.match(passwdRegExp)) {
    res.status(203).send('The password is not safe enough!');
    return;
  }

  pool.query(`SELECT * FROM users WHERE email = '${req.body.email}'`, (err, results) => {
    
    if (err) {
      res.status(500).send("An error occurred while accessing the database!");
      return;
    }

    if (results.length != 0) {
      res.status(203).send('This email address is already registerd');
      return;
    }

    pool.query(`INSERT INTO users VALUES('${uuid.v4()}', '${req.body.name}', '${req.body.email}', '${req.body.phone}', 'user', '1', SHA1('${req.body.passwd}'))`, (err, results) => {
      
      if (err) {
        res.status(500).send("An error occurred while accessing the database!");
        return;
      }
      res.status(200).send('Successful registration!');
      return;
    });
    return;
  });
});

//user login
app.post('/login', (req, res) => {
  
  if (!req.body.email || !req.body.passwd) {
    res.status(203).send('Missing fields!');
    return;
  }

  pool.query(`SELECT name, email, password, role FROM users WHERE email = '${req.body.email}' AND password = '${CryptoJS.SHA1(req.body.passwd)}'`, (err, results) => {

    if (err) {
      res.status(500).send("An error occurred while accessing the database!");
      return;
    }

    if (results.length == 0){
      res.status(203).send('Wrong email or password!');
      return;
    }

    res.status(202).send(results);
      return;
    });
    return;
});