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
        res.json({ valid: false })
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