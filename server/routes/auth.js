const express = require('express'),
      router  = express.Router(),
      jwt     = require("jsonwebtoken"),
      User    = require("../models/user");

const SECRET = 'frupblvke';
const rules = {
  email: [
    v => !!v                                     || 'E-mail is required',
    v => /^[a-z0-9.-@]*$/i.test(v)               || 'Only digits, latin letters as well as . and - are allowed',
    v => /^[a-z0-9].*$/i.test(v)                 || 'Email must begin with digit or a latin letter',
    v => /^.*@.*$/i.test(v)                      || 'Email must contain @ symbol',
    v => /^([a-z0-9]+[-.]?)*@.*$/i.test(v)       || 'Symbol repetition is not allowed',
    v => /^.*[a-z0-9]@.*$/i.test(v)              || 'A digit or a latin letter is to be before @ symbol',
    v => /^.*@[a-z0-9].*$/i.test(v)              || 'Domain is to begin with a digit or a latin letter',
    v => /^.*@(.+\.+)+.*$/i.test(v)              || 'Domain must contain at least one dot',
    v => /^.*@([a-z0-9]+[-.]?)*[a-z]*$/i.test(v) || 'Domain symbol repetition is not allowed',
    v => /^.*[0-9a-z]$/i.test(v)                 || 'Domain must end with either a digit or a latin letter'
  ],
  login: [
    v => !!v                           || 'Name is required',
    v => (v && v.length <= 32)         || 'Name must be 32 characters or less',
    v => /^[а-яёa-z0-9].*$/i.test(v)   || 'Login must begin with a letter or a digit',
    v => /^.[а-яёa-z0-9-_]*$/i.test(v) || 'Login may only contain letters and digits as well as - and _ symbols',
    v => /^.*[а-яёa-z0-9]$/i.test(v)   || 'Login must end with a letter or a digit'
  ],
  password: [
    v => !!v                  || 'Password is required',
    v => (v && v.length >= 8) || 'Name must be 8 characters or more',
    v => /^\S+$/.test(v)      || 'No spaces are allowed'
  ]
};

function validate(req) {
  let isValid = true;
  if (req.body.email && isValid) {
    isValid = rules.email.every(rule => {
      return rule(req.body.email) === true
    });
  }
  if (req.body.login && isValid) {
    isValid = rules.login.every(rule => {
      return rule(req.body.login) === true
    })
  }
  if (req.body.password && isValid) {
    isValid = rules.password.every(rule => {
      return rule(req.body.password) === true
    })
  }

  return isValid;
}

  // response bad credentials
function rbc(res) {
  res.status(400).json({ result: 0, message: "Bad credentials" })
}

module.exports = (app) => {
/*
  this middleware parses headers and query for token
  if successful, it queries db for user data and appends it to req
  thus passing req.user data to following wares
 */
  app.use(async (req,res,next) => {
    let token = null;
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {
      token = req.query.token;
    }

    if (token) {
      try {
        let decoded = jwt.verify(token, SECRET);
        if (decoded) {
          try {
            await User.findById(decoded.id, (err, user) => {
              if (user) {
                req.user = user;
              }
            });
          } catch (err) {
            console.log(err.message)
          }
        }
      } catch(err) {

      }
    }

    next();
  });

// Handle calls

  router.post("/verify", async (req, res) => {
    if (validate(req)) {
      await User.findOne({ email: req.body.email }, (err, user) => {
        if (user) {
          if (user.password === req.body.password) {
            res.json({ result: 1, message: 'Success' })
          } else {
            rbc(res);
          }
        } else {
          rbc(res);
        }
      })
    } else {
      rbc(res);
    }
  });

  router.post("/verifyRegister", async (req, res) => {
    if (validate(req)) {
      await User.findOne({ email: req.body.email }, (err, user) => {
        if (!user) {
          res.json({ result: 1, valid: true })
        } else {
          res.status(400).json({ result: 0, message: 'User already exists' })
        }
      });
    } else {
      rbc(res);
    }
  });

  router.post("/register", async (req, res) => {
    if (validate(req)) {
      await User.findOne({ email: req.body.email }, (err, user) => {
        if (!user) {
          try {
            const user = new User({
              login:    req.body.login,
              email:    req.body.email,
              password: req.body.password
            });
            user.save();
            res.json({ result: 1, message: 'Successfully registered'});
          } catch (err) {
            res.status(500).json({ result: 0, message: err.message })
          }
        } else {
          res.status(400).json({ result: 0, message: "User with that E-mail is already registered" })
        }
      });
    } else {
      rbc(res);
    }
  });

  router.post("/login", async (req, res) => {
    if (validate(req)) {
      await User.findOne({ email: req.body.email }, (err, user) => {
        if (user) {
          if (!user.password === req.body.password) {
            rbc(res);
          }
          jwt.sign(
            { id: user._id },
            SECRET,
            (err, token) => {
              res.json({ token });
            }
          );
        } else {
          res.status(400).json({ result: 0, message: 'User does not exist' });
        }
      });
    } else {
      rbc(res);
    }
  });

  router.get("/me", async (req, res) => {
    if (req.user) {
      res.json({ user: req.user })
    } else {
      rbc(res);
    }
  });

  return router;
};