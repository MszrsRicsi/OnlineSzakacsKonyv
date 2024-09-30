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


  pool.query(`SELECT id, name, email, password, status, role FROM users WHERE email = '${req.body.email}' AND password = '${CryptoJS.SHA1(req.body.passwd)}'`, (err, results) => {

    if (err) {
      res.status(500).send("An error occurred while accessing the database!");
      return;
    }

    if (results.length == 0){
      res.status(203).send('Wrong email or password!');
      return;
    }

    if (results[0].status == 0) {
      res.status(203).send('You are considered an inactive user!');
      return;
    }

    res.status(202).send(results);
      return;
    });
    return;
});

//user profile editing (password)
app.patch('/passwd/:id', (req, res) => {

  if (!req.params.id) {
    res.status(203).send('Missing identifier!');
    return;
  }

  if (!req.body.oldpasswd || !req.body.newpasswd || !req.body.confirmpasswd) {
    res.status(203).send('Missing fields!');
    return;
  }

  if (req.body.newpasswd != req.body.confirmpasswd) {
    res.status(203).send('The given passwords are not matching');
    return;
  }

  if (!req.body.newpasswd.match(passwdRegExp)){
    res.status(203).send('The new password is not safe enough')
    return;
  }

  pool.query(`SELECT password FROM users WHERE id='${req.params.id}'`, (err, results) => {
    if (err){
      res.status(500).send('An error occurred while accessing the database!');
      return;
    }

    if (results.length == 0) {
      res.status(203).send('Wrong identifier');
      return;
    }

    if (results[0].password != CryptoJS.SHA1(req.body.oldpasswd)) {
        res.status(203).send('The current password is wrong!')
        return;
    }

    pool.query(`UPDATE users SET password = SHA1('${req.body.newpasswd}') WHERE id = '${req.params.id}'`, (err, results) => {
      if (err) {
        res.status(500).send('An error occurred while accessing the database!');
        return;
      }

      if (results.affectedRows == 0) {
        res.status(203).send('Wrong identifier');
        return;
      }

      res.status(200).send('Password is modified');
      return;
    });
  });
});

//user profile editing (phone)
app.patch('/phone/:id', (req, res)=>{

  if (!req.params.id) {
    res.status(203).send('Missing identifier!');
    return;
  }

  pool.query(`UPDATE users SET phone = ${req.body.newphone} WHERE id = '${req.params.id}'`, (err, results) => {
    if (err) {
      res.status(500).send('An error occurred while accessing the database!');
      return;
    }
    
    if (results.affectedRows == 0) {
      res.status(203).send('Wrong identifier');
      return;
    }

    res.status(200).send('Phone number is modified');
    return;
  });
});

//user profile editing (email)
app.patch('/email/:id', (req, res) => {
  
  if (!req.params.id) {
    res.status(203).send('Missing identifier!');
    return;
  }

  pool.query(`UPDATE users SET email = '${req.body.newemail}' WHERE id = '${req.params.id}'`, (err, results) => {
    if (err) {
      res.status(500).send('An error occurred while accessing the database!');
      return;
    }
    
    if (results.affectedRows == 0) {
      res.status(203).send('Wrong identifier');
      return;
    }

    res.status(200).send('Email address is modified');
    return;
  });
});

//get recipes
app.get('/recipes', (req, res) => {
  pool.query(`SELECT * FROM recipes`, (err, results) => {
    if (err) {
      res.status(500).send("An error occurred while accessing the database!");
      return;
    }

    res.status(202).send(results);
    return;
  });
});

//get all categories
app.get('/categories', (req, res) => {
  pool.query(`SELECT * FROM categories`, (err, results) => {
    if (err) {
      res.status(500).send("An error occurred while accessing the database!");
      return;
    }

    res.status(202).send(results);
    return;
  });
});

//get one category by id
app.post('/category', (req, res) => {
  if (!req.body.id)
  {
    res.status(203).send("Missing indentifier!");
    return;
  }

  pool.query(`SELECT * FROM categories WHERE id = '${req.body.id}'`, (err, results) => {
    if (err) {
      res.status(500).send("An error occurred while accessing the database!");
      return;
    }

    res.status(202).send(results);
    return;
  });
});

//upload new recipe
app.post("/upload", (req, res) => {
  if (!req.body.category || !req.body.title || !req.body.time || !req.body.additions || !req.body.calories)
  {
    res.status(203).send("Missing fields!");
    return;
  };

  pool.query(`INSERT INTO recipes VALUES ('', '${req.body.category}', '${req.body.userID}', '${req.body.title}', '', '${req.body.time}', '${req.body.additions}', '${req.body.calories}')`, (err, results) => {
    if (err) {
      res.status(500).send("An error occurred while accessing the database!");
      return;
    }

    res.status(200).send('Added recipe!');
    return;
  });
});

//get all users
app.get("/users", (req, res) => {
  pool.query(`SELECT id, name, role, status FROM users`, (err, results) => {
    if (err) {
      res.status(500).send("An error occurred while accessing the database!");
      return;
    }

    res.status(202).send(results);
    return;
  });
});

//delete user by id
app.delete("/users/:id", (req, res) => {
  if (!req.params.id) {
    res.status(203).send('Missing identifier!');
    return;
  }

  pool.query(`DELETE FROM users WHERE id = '${req.params.id}'`, (err, results) => {
    if (err) {
      res.status(500).send("An error occurred while accessing the database!");
      return;
    }

    res.status(202).send("Account deleted!");
    return;
  });
});

//modify user by id
app.patch("/users/:id", (req, res) => {
  if (!req.params.id) {
    res.status(203).send('Missing identifier!');
    return;
  }

  pool.query(`UPDATE users SET role = '${req.body.newrole}', status = '${req.body.newstatus}' WHERE id = '${req.params.id}'`, (err, results) => {
    if (err) {
      res.status(500).send("An error occurred while accessing the database!");
      return;
    }

    res.status(202).send("Account modified!");
    return;
  });
});

app.listen(process.env.PORT, () => {
  console.clear();
  console.log(`Server is listening on port ${process.env.PORT}.`);
});