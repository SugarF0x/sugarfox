/**
 * Authentication module
 * @category server
 * @module auth
 *
 * @requires express
 * @requires express.Router
 * @requires request
 * @requires jwt
 * @requires models/user
 *
 * @author {@link https://github.com/SugarF0x Sugar_F0x}
 */

const express = require('express'),
      router  = express.Router(),
      request = require('request'),
      jwt     = require("jsonwebtoken"),
      User    = require("../models/user");

/**
 * A req.body object is ran through these rules on validate(req)<br>
 * validate(req) is used in local verification, register and login calls<br>
 * On success it returns TRUE<br>
 * On failure it returns fail condition statement
 *
 * @type {object}
 */
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
    v => !!v                                     || 'Name is required',
    v => (v && v.length <= 32)                   || 'Name must be 32 characters or less',
    v => /^[а-яА-ЯёЁa-z0-9].*$/i.test(v)         || 'Login must begin with a letter or a digit',
    v => /^.[а-яА-ЯёЁa-z0-9-_ ]*$/i.test(v)      || 'Login may only contain letters and digits as well as - _ symbols and space bar',
    v => /^([а-яА-ЯёЁa-z0-9]+[-. ]?)*$/i.test(v) || 'Login may not contain repetitions of special symbols',
    v => /^.*[а-яА-ЯёЁa-z0-9]$/i.test(v)         || 'Login must end with a letter or a digit'
  ],
  password: [
    v => !!v                  || 'Password is required',
    v => (v && v.length >= 8) || 'Name must be 8 characters or more',
    v => /^\S+$/.test(v)      || 'No spaces are allowed'
  ]
};

/**
 * Run validation tests of given request body based on rules object
 *
 * @param {object} req - request object
 * @returns {boolean}
 */
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

/**
 * Return bad credentials
 *
 * @param {object} res - Response object
 * @returns {void} JSON to the client
 */
function rbc(res) {
  res.status(400).json({ result: 0, message: "Bad credentials" })
}

/**
 * Auth strategy disabled
 *
 * @param {object} res - Response object
 * @param {string} strat - What strategy is disabled
 * @returns {void} JSON to the client
 */
function asd(res, strat) {
  res.status(500).json({ result: 0, message: `${strat} auth Strategy disabled` })
}

/**
 * Append query object as url GET parameters <br>
 *   Keys will be used as GET parameters
 *
 * @param {string} url - URL to append query to
 * @param {object} query - Object to be appended to URL as GET parameters
 * @returns {string} Full path with query
 */
function addQueryToUrl(url, query) {
  return url + '?' + Object.keys(query).map(function(k) {
    return encodeURIComponent(k) + "=" + encodeURIComponent(query[k]);
  }).join('&')
}

/**
 * Express Router for Auth module that will be exported to main express app
 *
 * @namespace router
 */
module.exports = (app) => {
  const cookieParser = require("cookie-parser");
  app.use(cookieParser());

  /**
   * This middleware parses headers and query for token<br>
   * If successful, it queries db for user data and appends it to req<br>
   * thus passing req.user data to following wares<br>
   * <br>
   * This middleware is NOT restricted to this module
   *
   * @name Append user middleware
   * @function
   * @inner
   * @memberOf module:auth~router
   * @param {object} req
   * @param {object} res
   * @param {object} next
   */
  app.use(async (req,res,next) => {
    if (process.env.MONGO_DB !== 'false') {
      let token = null;
      if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        token = req.headers.authorization.split(' ')[1];
      } else if (req.query && req.query.token) {
        token = req.query.token;
      }

      if (token) {
        if (req.cookies["auth.strategy"] === 'local') {
          if (process.env.AUTH_SECRET !== 'false') {
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
                  console.log('error: ', err.message);
                  next();
                }
              }
            } catch(err) {
              next();
            }
          } else {
            console.log('\x1b[31mX\x1b[0m', 'Local auth Strategy disabled, user set to NULL');
            next();
          }
        } else if (req.cookies["auth.strategy"] === 'vk') {
          request(addQueryToUrl('https://api.vk.com/method/users.get', {
            access_token: req.cookies["auth._token.vk"].split(' ')[1],
            fields: 'photo_max',
            v: '5.110'
          }), (err, response, body) => {
            body = JSON.parse(body);
            if (body.error) {
              console.log('error: ', body.error.error_msg);
              next();
            } else {
              User.findOne({ id: body.response[0].id }, (err, user) => {
                // this line unlinks user object from db and lets me edit it before sending
                user = JSON.parse(JSON.stringify(user));
                if (user) {
                  ['_id','permission','password','__v','created_date'].forEach(entry => {
                    delete user[entry]
                  });
                  req.user = user;
                  next();
                } else {
                  User.find({}, (err, user) => {
                    const newUserData = {
                      method:   'vk',
                      id:       body.response[0].id,
                      publicId: 'id' + (user.length + 1),
                      login:    body.response[0].first_name + ' ' + body.response[0].last_name,
                      avatar:   body.response[0].photo_max
                    };
                    const newUser = new User(newUserData);
                    newUser.save();
                    req.user = newUserData;
                    next();
                  });
                }
              });
            }
          });
        }
      } else {
        next();
      }
    } else {
      next()
    }
  });

  /**
   * This middleware checks to see if database is available<br>
   * as no authorization method will work without one
   * <br>
   * This middleware IS restricted to this module
   *
   * @name Database availability middleware
   * @function
   * @memberOf module:auth~router
   * @inner
   * @param {callback} middleware - Middleware function
   * @returns {void}
   */
  router.use(async (req,res,next) => {
    if (process.env.MONGO_DB === 'false') {
      res.status(500).json({ result: 0, message: 'Authorization unavailable - database disabled' })
    } else {
      next()
    }
  });

  /**
   * This POST route validates user form and searches for stated user in database<br>
   * In case of successful validation and if such a user is found and password is a match,<br>
   * {result: 1} is returned and client can proceed with authorization
   *
   * @name /verify
   * @function
   * @memberOf module:auth~router
   * @inner
   * @param {string} path - Express path
   * @param {callback} middleware - Express middleware
   * @returns {void} JSON to client
   */
  router.post("/verify", async (req, res) => {
    if (process.env.AUTH_SECRET === 'false') {
      asd(res, 'Local');
    } else

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

  /**
   * This POST route validates user form and searches for stated user in database<br>
   * In case of successful validation and if such a user does not already exist,<br>
   * {result: 1} is sent and client can proceed with registration
   *
   * @name /verifyRegister
   * @function
   * @memberOf module:auth~router
   * @inner
   * @param {string} path - Express path
   * @param {callback} middleware - Express middleware
   * @returns {void} JSON to client
   */
  router.post("/verifyRegister", async (req, res) => {
    if (process.env.AUTH_SECRET === 'false') {
      asd(res, 'Local');
    } else

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

  /**
   * This route validates client form and in case of a success,<br>
   * a new user entry is created in the database<br>
   * and said user data is returned to the client
   *
   * @name /register
   * @function
   * @memberOf module:auth~router
   * @inner
   * @param {string} path - Express path
   * @param {callback} middleware - Express middleware
   * @returns {void} JSON to client
   */
  router.post("/register", async (req, res) => {
    if (process.env.AUTH_SECRET === 'false') {
      asd(res, 'Local');
    } else

    if (validate(req)) {
      let newId = '';
      await User.find({}, (err, user) => {
        newId = user.length + 1;
      });
      await User.findOne({ email: req.body.email }, (err, user) => {
        if (!user) {
          try {
            const newUser = new User({
              method:   'local',
              id:       Date.now(),
              publicId: 'id' + newId,
              login:    req.body.login,
              email:    req.body.email,
              password: req.body.password
            });
            newUser.save();
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

  /**
   * This route validates client form and in case of a success,<br>
   * access token gets signed and sent to the client.<br>
   * The client will be able to use said token to proceed with authorization
   *
   * @name /login
   * @function
   * @memberOf module:auth~router
   * @inner
   * @param {string} path - Express path
   * @param {callback} middleware - Express middleware
   * @returns {void} JSON to client
   */
  router.post("/login", async (req, res) => {
    if (process.env.AUTH_SECRET === 'false') {
      asd(res, 'Local');
    } else

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

  /**
   * This route is a VK strategy auth callback from VK oauth page.<br>
   * User gets redirected here bearing a code, that is then used to request access token,<br>
   * that then gets sent back to the client, who wil be able to use it to proceed with authorization
   *
   * @name /login/vk
   * @function
   * @memberOf module:auth~router
   * @inner
   * @param {string} path - Express path
   * @param {callback} middleware - Express middleware
   * @returns {void} JSON to client
   */
  router.get("/login/vk", async (req, res) => {
    if (process.env.VK_SECRET === 'false' || process.env.VK_CLIENT_ID === 'false') {
      asd(res, 'VK');
    } else

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

  /**
   * This route returns req.user object if one is present
   *
   * @name /me
   * @function
   * @memberOf module:auth~router
   * @inner
   * @param {string} path - Express path
   * @param {callback} middleware - Express middleware
   * @returns {void} JSON to client
   */
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
      if (process.env.AUTH_SECRET === 'false') {
        asd(res, 'Local');
      } else rbc(res);
    }
  });

  /**
   * This route searches for a user by his publicId and sends his data is one is found
   *
   * @name /getUsers
   * @function
   * @memberOf module:auth~router
   * @inner
   * @param {string} path - Express path
   * @param {callback} middleware - Express middleware
   * @returns {void} JSON to client
   */
  router.post('/getUser', async (req,res) => {
    await User.findOne({ publicId: req.body.publicId }, (err, user) => {
      res.json({ result: 1, user: user });
    })
  });

  return router;
};