const express = require('express'),
      router  = express.Router(),
      jwt     = require("jsonwebtoken"),
      User    = require("../models/user");

const SECRET = 'frupblvke';

// this function checks if request is authorised and returns decoded user if so

function isAuthed(req) {
  if (req.headers.authorization) {
    try {
      // var is redundant but its better that was so as not to return error
      // noinspection UnnecessaryLocalVariableJS
      let decoded = jwt.verify(req.headers.authorization.split(' ')[1], SECRET);
      return decoded;
    } catch(err) {
      return false;
    }
  } else {
    return false;
  }
}

// const app          = express(),
//       ejwt         = require("express-jwt"),
//       cookieParser = require('cookie-parser');

// app.use(cookieParser());
// app.use(
//   ejwt({
//     secret: SECRET
//   }).unless({
//     path: "api/auth/login"
//   })
// );

// Handle calls

router.post("/verify", async (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (user) {
      if (user.password === req.body.password) {
        res.json({ valid: true })
      } else {
        res.json({ valid: false })
      }
    } else {
      res.json({ valid: false })
    }
  })
});

router.post("/verifyRegister", async (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (user) {
      res.json({ valid: false })
    } else {
      res.json({ valid: true })
    }
  })
});

router.post("/register", async (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (user) {
      res.status(400).json({ result: 0, message: "User with that E-mail is already registered" })
    } else {
      try {
        const user = new User({
          login: req.body.login,
          email: req.body.email,
          password: req.body.password
        });
        user.save();
        res.json({ result: 1 });
      } catch (err) {
        res.status(500).json({ result: 0, message: err.message })
      }
    }
  })
});

router.post("/login", async (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (user) {
      if (!user.password === req.body.password) {
        res.json({ message: 'invalid password' });
      }
      jwt.sign(
        { id: user._id },
        SECRET,
        (err, token) => {
          res.json({ token });
        }
      );
    } else {
      res.status(400).json({ result: 0, message: 'Invalid username' });
    }
  });
});

router.get("/me", async (req, res) => {
  let token = isAuthed(req);
  if (token) {
    try {
      User.findById(token.id, (err, user) => {
        if (user) {
          res.json({ user });
        } else {
          res.json({message: err.message});
        }
      });
    } catch (err) {
      res.json({message: err.message});
    }
  }
});

module.exports = router;