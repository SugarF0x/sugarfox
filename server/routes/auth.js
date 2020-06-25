const express = require('express'),
      router  = express.Router(),
      request = require('request'),
      jwt     = require("jsonwebtoken"),
      User    = require("../models/user");

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

function addQueryToUrl(url, query) {
  return url + '?' + Object.keys(query).map(function(k) {
    return encodeURIComponent(k) + "=" + encodeURIComponent(query[k]);
  }).join('&')
}

module.exports = (app) => {
  const cookieParser = require("cookie-parser");
  app.use(cookieParser());

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
      if (req.cookies["auth.strategy"] === 'local') {
        try {
          let decoded = jwt.verify(token, process.env.AUTH_SECRET);
          if (decoded) {
            try {
              await User.findById(decoded.id, (err, user) => {
                  // this line unlinks user object from db and lets me edit it before sending
                user = JSON.parse(JSON.stringify(user));
                if (user) {
                  ['_id','permission','password','__v','created_date'].forEach(entry => {
                    delete user[entry]
                  });
                  req.user = user;
                }
                next();
              });
            } catch (err) {
              console.log(err.message);
              next();
            }
          }
        } catch(err) {
          next();
        }
      } else if (req.cookies["auth.strategy"] === 'vk') {
        request(addQueryToUrl('https://api.vk.com/method/users.get', {
          access_token: req.cookies["auth._token.vk"].split(' ')[1],
          v: '5.110'
        }), (err, response, body) => {
          body = JSON.parse(body);
          if (body.error) {
            console.log('error: ', body.error.error_msg);
          } else {
            // TODO: link vk user to mongodb
            // check with db for said user
            // for now - just return the vk user data
            req.user = {
              login: body.response[0].first_name + ' ' + body.response[0].last_name,
              method: 'vk',
              permission: 'default'
            };
            next();
          }
        });
      }
    } else {
      next();
    }
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
              method:   'local',
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
            process.env.AUTH_SECRET,
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

  router.get("/login/vk", async (req, res) => {
    await request(addQueryToUrl('https://oauth.vk.com/access_token', {
      client_id:     process.env.VK_CLIENT_ID,
      client_secret: process.env.VK_SECRET,
      redirect_uri:  process.env.BASE_URL+ '/profile/auth/vk',
      code:          req.query.code
    }), (error, response, body) => {
      body = JSON.parse(body);
      if (body.error) {
        res.status(400).json({ result: 0, message: body.error_description });
      } else {
        res.json({ access_token: body.access_token })
      }
    });
  });

  router.get("/me", async (req, res) => {
    if (req.user) {
      switch (req.user.method) {
        case 'local':
          res.json({ user: req.user });
          break;
        case 'vk':
          res.json(req.user);
          break;
        default:
          rbc(res);
          break;
      }
    } else {
      rbc(res);
    }
  });

  return router;
};