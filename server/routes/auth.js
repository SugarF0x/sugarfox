const express = require('express'),
      router  = express.Router(),
      jwt     = require("jsonwebtoken"),
      User    = require("../models/user");

const SECRET = 'frupblvke';

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

router.get("/getUsers", async (req, res) => {
  try {
    const users = await User.find();
    await res.json(users);
  } catch (err) {
    res.status(500).json({message: err.message})
  }
});

router.post("/verify", async (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (user) {
      if (user.password === req.body.password) {
        res.json({ valid: true })
      } else {
        res.json({ valid: true })
      }
    } else {
      res.json({ valid: false })
    }
  })
});

router.post("/login", async (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (user) {
      if (!user.password === req.body.password) {
        res.json({ message: 'invalid password' });
      }
      jwt.sign( // TODO: make this store a Users _id instead of email and in /auth/me user .findById
        { email: req.body.email },
        SECRET,
        (err, token) => {
          res.json({ token });
        }
      );
    } else {
      res.json({ message: 'Invalid username' });
    }
  });
});

router.get("/me", async (req, res) => {
  if (req.headers.authorization) {
    try {
      User.findById({ email: 'some@email' }, (err, user) => {
        if (!err) {
          res.json({ user });
        } else {
          res.json({message: err.message});
        }
      });
    } catch (err) {
      res.json({message: err.message});
    }
  } else {
    res.send(false);
  }
});

  // an instance of successfully adding a new user to the database

// router.get("/setAdmin", async (req, res) => {
//   try {
//     const adminUser = new User({
//       login: "admin",
//       email: "admin@admin.admin",
//       password: "123123123",
//       permission: "admin",
//     });
//     adminUser.save();
//     await res.send("added admin user");
//   } catch (err) {
//     res.status(500).json({message: err.message})
//   }
// });

module.exports = router;