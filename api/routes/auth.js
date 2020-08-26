/**
 * Authentication module
 * @category server
 * @subcategory routes
 * @namespace server.auth
 *
 * @requires express
 * @requires express.Router
 * @requires request
 * @requires jwt
 * @requires models/user
 * @requires bcrypt
 *
 * @author {@link https://github.com/SugarF0x Sugar_F0x}
 */
const express = require('express');
const router  = express.Router();
const request = require('request');
const jwt     = require("jsonwebtoken");
const User    = require("../models/user");
const bcrypt  = require('bcrypt'); // TODO: make bcrypt optional as it requires Python soft installed on server machine
const consola = require('consola');

// TODO: add verbose mode in .env that will log every request and everything they are going through

// TODO: change the way new publicIDs are generated
//   as for now if an existing user gets deleted, a fresh sign up
//   will get an already reserved publicID

/**
 * A req.body object is ran through these rules on validate(req)<br>
 * validate(req) is used in local verification, register and login calls<br>
 * On success it returns TRUE<br>
 * On failure it returns fail condition statement
 *
 * @category server
 * @subcategory routes
 * @memberof server.auth
 * @inner
 *
 * @name Validation rules
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
  ],
  address: [
    v => !!v                               || 'Address is required',
    v => (v.length >= 1 && v.length <= 32) || 'Address must be between 1 and 32 characters long',
    v => /^[a-z0-9_-]*$/i.test(v)          || 'Only digits, latin letters as well as _ and - are allowed',
    v => /^id\d+$/.test(v)                 || 'Address can not replicate default id route (e.g. /id123)'
  ]
};

/**
 * Run validation tests of given request body based on rules object
 *
 * @category server
 * @subcategory routes
 * @memberof server.auth
 * @inner
 *
 * @param {object} req - request object
 * @returns {boolean}
 */
function validate(req) {
  let isValid = true;
  if (req.body.email    && isValid) {
    isValid = rules.email.every(rule => {
      return rule(req.body.email) === true
    });
  }
  if (req.body.login    && isValid) {
    isValid = rules.login.every(rule => {
      return rule(req.body.login) === true
    })
  }
  if (req.body.password && isValid) {
    isValid = rules.password.every(rule => {
      return rule(req.body.password) === true
    })
  }
  if (req.body.address  && isValid) {
    isValid = rules.address.every(rule => {
      return rule(req.body.address) === true
    })
  }

  return isValid;
}

/**
 * Send 'Bad credentials' response
 *
 * @category server
 * @subcategory routes
 * @memberof server.auth
 * @inner
 *
 * @param {object} res - Response object
 * @returns {response} { result, message }
 */
function rbc(res) {
  res.status(400).json({ result: 0, message: "Bad credentials" })
}

/**
 * Send 'Auth strategy disabled' response
 *
 * @category server
 * @subcategory routes
 * @memberof server.auth
 * @inner
 *
 * @param {object} res - Response object
 * @param {string} strat - What strategy is disabled
 * @returns {response} { result, message }
 */
function asd(res, strat) {
  res.status(500).json({ result: 0, message: `${strat} auth Strategy disabled` })
}

/**
 * Append query object as url GET parameters <br>
 * Keys will be used as GET parameters
 *
 * @category server
 * @subcategory routes
 * @memberof server.auth
 * @inner
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

module.exports = (app) => {
  /**
   * Middleware parsing headers and query for token<br>
   * If successful, it queries db for user data and appends it to req<br>
   * thus passing req.user data to following wares<br>
   * <br>
   * This middleware is NOT restricted to this module
   *
   * @category server
   * @subcategory routes
   * @memberof server.auth
   * @static
   *
   * @name Append user
   * @function
   * @type {Middleware} next()
   */
  app.use(async (req,res,next) => {
    if (process.env.MONGO_DB !== 'false') {

        // TODO: redo this section to work off of cookies rather than headers - for proper SSR

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
                      ['_id','password','__v','created_date'].forEach(entry => {
                        delete user[entry]
                      });
                      req.user = user;
                    }
                    next();
                  });
                } catch (err) {
                  consola.error('Middleware error: ' + err.message);
                  next();
                }
              }
            } catch(err) {
              next();
            }
          } else {
            consola.info('Local auth Strategy disabled, user will not be set');
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
              consola.error('Middleware error: ' + body.error.error_msg);
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
                  next();
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
   * Middleware checking if database is available<br>
   * as no authorization method will work without one
   * <br>
   * This middleware IS restricted to this module
   *
   * @category server
   * @subcategory routes
   * @memberof server.auth
   * @inner
   *
   * @name Database availability
   * @function
   * @type {Middleware} next()
   */
  router.use(async (req,res,next) => {
    if (process.env.MONGO_DB === 'false') {
      res.status(500).json({ result: 0, message: 'Authorization unavailable - database disabled' })
    } else {
      next()
    }
  });

  /**
   * Route serving user login form validation by rules{} as well as by searching stated user in the database
   *
   * @category server
   * @subcategory routes
   * @memberof server.auth
   * @inner
   *
   * @name /verify
   * @function
   * @type {POST} { result, message }
   *
   * @param {object} req.body          - Payload
   * @param {object} req.body.email    - New user email
   * @param {object} req.body.password - New user password
   */
  router.post("/verify", async (req, res) => {
    if (process.env.AUTH_SECRET === 'false') {
      asd(res, 'Local');
    } else

    if (validate(req)) {
      await User.findOne({ email: req.body.email }, (err, user) => {
        if (user) {
          bcrypt.compare(req.body.password, user.password, (err, result) => {
            if (result) {
              res.json({ result: 1, message: 'Success' })
            } else {
              rbc(res);
            }
          });
        } else {
          rbc(res);
        }
      })
    } else {
      rbc(res);
    }
  });

  /**
   * Route serving user register form validation by rules{} as well as by searching stated user in the database
   *
   * @category server
   * @subcategory routes
   * @memberof server.auth
   * @inner
   *
   * @name /verifyRegister
   * @function
   * @type {POST} { result, message }
   *
   * @param {object} req.body          - Payload
   * @param {object} req.body.email    - New user email
   * @param {object} req.body.password - New user password
   * @param {object} req.body.login    - New user login
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
   * Route serving client form validation and new user DB entry creation
   *
   * @category server
   * @subcategory routes
   * @memberof server.auth
   * @inner
   *
   * @name /register
   * @function
   * @type {POST} { result, message }
   *
   * @param {object} req.body          - Payload
   * @param {object} req.body.email    - New user email
   * @param {object} req.body.password - New user password
   * @param {object} req.body.login    - New user login
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
              password: bcrypt.hashSync(req.body.password, 7)
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
   * Route serving client login form validation and jwt signature<br>
   * Client can use said token to access their user data via /me calls
   *
   * @category server
   * @subcategory routes
   * @memberof server.auth
   * @inner
   *
   * @name /login
   * @function
   * @type {POST} { token } || { result, message }
   *
   * @param {object} req.body          - Payload
   * @param {object} req.body.email    - User email
   * @param {object} req.body.password - User password
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
   * Route serving VK auth strategy callback from VK oauth page<br>
   * User gets redirected here bearing a code, that is then used to request access token,<br>
   * that then gets sent back to the client, who wil be able to use it to proceed with authorization
   *
   * @category server
   * @subcategory routes
   * @memberof server.auth
   * @inner
   *
   * @name /login/vk
   * @function
   * @type {GET} { access_token } || { result, message }
   *
   * @property {parameter} code - Access code granted by VK auth
   */
  router.get("/login/vk", async (req, res) => {
    if (process.env.VK_SECRET === 'false' || process.env.VK_CLIENT_ID === 'false') {
      asd(res, 'VK');
    } else

    await request(addQueryToUrl('https://oauth.vk.com/access_token', {
      client_id:     process.env.VK_CLIENT_ID,
      client_secret: process.env.VK_SECRET,
      redirect_uri:  process.env.PROTOCOL + '://' + process.env.BASE_URL+ '/profile/auth/vk',
      code:          req.query.code
    }), async (error, response, body) => {
      body = JSON.parse(body);
      let token = body.access_token;
      if (body.error) {
        res.status(400).json({ result: 0, message: body.error_description });
      } else {
        await request(addQueryToUrl('https://api.vk.com/method/users.get', {
          access_token: token,
          fields: 'photo_max',
          v: '5.110'
        }), async (err, response, body) => {
          body = JSON.parse(body);
          if (body.error) {
            res.status(500).json({ result: 0, message: body.error.error_msg });
          } else {
            await User.findOne({ id: body.response[0].id }, async (err, user) => {
              if (!user) {
                await User.find({}, (err, user) => {
                  const newUserData = {
                    method:   'vk',
                    id:       body.response[0].id,
                    publicId: 'id' + (user.length + 1),
                    login:    body.response[0].first_name + ' ' + body.response[0].last_name,
                    avatar:   body.response[0].photo_max
                  };
                  const newUser = new User(newUserData);
                  newUser.save();
                  res.json({ access_token: token })
                });
              } else {
                res.json({ access_token: token })
              }
            });
          }
        });
      }
    });
  });

  /**
   * Route searching for { req.user } based on strategy used (if any)
   *
   * @category server
   * @subcategory routes
   * @memberof server.auth
   * @inner
   *
   * @name /me
   * @function
   * @type {GET} { user } || { result, message }
   *
   * @param {object} req.body          - Payload
   * @param {object} req.body.publicId - User ID to look for in Database
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
      } else
          res.status(401).json({ result: 0, message: "Unauthorized" });
    }
  });

  /**
   * Route searching for user by publicId
   *
   * @category server
   * @subcategory routes
   * @memberof server.auth
   * @inner
   *
   * @name /getUsers
   * @function
   * @type {POST} { result, user|message }
   *
   * @param {object} req.body          - Payload
   * @param {object} req.body.publicId - User ID to look for in Database
   */
  router.post('/getUser', async (req,res) => {
    let search = {};
      // test if complies with 'id123456789' naming
    if (/^id\d+$/.test(req.body.publicId)) {
      search = { id: req.body.publicId.slice(2) };
    } else {
      search = { publicId: req.body.publicId };
    }
    consola.log(search);

    await User.findOne(search, (err, user) => {
      if (user) {
        res.json({ result: 1, user: user });
      } else {
        res.json({ result: 0, message: 'User not found' })
      }
    })
  });

  /**
   * Route operating user settings based on req.user's id and payload data
   *
   * @category server
   * @subcategory routes
   * @memberof server.auth
   * @inner
   *
   * @name /editUserData
   * @function
   * @type {POST} { result, message }
   *
   * @param {object} req.body - Payload, containing all the data to be changed
   */
  router.post('/editUserData', async (req, res) => {
    if (req.user) {
      if (validate(req)) {
        Object.keys(req.body).forEach(async entry => {
          try {
            switch (entry) {
              case 'password':
                await User.findOneAndUpdate(
                  { id: req.user.id },
                  { $set: { password: bcrypt.hashSync(req.body.password, 7) } },
                  { new: true, useFindAndModify: false }
                );
                res.json({ result: 1, message: `New password successfully set!`});
                break;
              case 'address':
                await User.findOne({ publicId: req.body.address }, async (err, user) => {
                  if (!user) {
                    try {
                      await User.findOneAndUpdate(
                        { id: req.user.id },
                        { $set: { publicId: req.body.address } },
                        { new: true, useFindAndModify: false });
                      res.json({ result: 1, message: `New address successfully set!`});
                    } catch (err) {
                      res.status(500).json({ result: 0, message: err.message })
                    }
                  } else {
                    res.status(400).json({ result: 0, message: "User with that address already exists" })
                  }
                });
                break;
              case 'options':
                for (let option in req.body[entry]) {
                  for (let state in req.body[entry][option]) {
                    let position = `${entry}.${option}.${state}`;
                    try {
                      await User.findOneAndUpdate(
                        { id: req.user.id },
                        { $set: { [position]: req.body[entry][option][state] } },
                        { new: true, useFindAndModify: false }
                      );
                      res.json({ result: 1, message: `New ${state} ${option} ${entry} successfully set!`});
                    } catch (err) {
                      res.status(500).json({ result: 0, message: 'Oops! SOmething went wrong!' })
                    }
                  }
                }
                break;
              case 'state':
                if (req.body.state === 'deleted') {
                  try {
                    await User.findOneAndUpdate(
                      { id: req.user.id },
                      { $set: { state: 'deleted', publicId: null } },
                      { new: true, useFindAndModify: false }
                    );
                    res.json({ result: 1, message: `State change successful`});
                  } catch (err) {
                    res.status(500).json({ result: 0, message: "Oops! Something went wrong!"})
                  }
                } else if (req.body.state === 'active') {
                  try {
                    await User.findOne({ publicId: req.user.publicId }, async (err, user) => {
                      if (!user) {
                        try {
                          await User.findOneAndUpdate(
                            { id: req.user.id },
                            { $set: { state: 'active', publicId: req.body.publicId } },
                            { new: true, useFindAndModify: false }
                          );
                          res.json({ result: 1, message: `State change successful`});
                        } catch (err) {
                          res.status(500).json({ result: 0, message: err.message })
                        }
                      } else {
                        res.status(400).json({ result: 0, message: "This address is already taken" })
                      }
                    });
                  } catch (err) {
                    res.status(500).json({ result: 0, message: "Oops! Something went wrong!"})
                  }
                }
                break;
              default:
                await User.findOneAndUpdate(
                  { id: req.user.id },
                  { $set: { [entry]: req.body[entry] } },
                  { new: true, useFindAndModify: false }
                );
                res.json({ result: 1, message: `New ${entry} successfully set!`});
                break;
            }
          } catch (err) {
            consola.error(err);
            res.status(500).json({ result: 0, message: "Oops! Something went wrong!"})
          }
        });
      } else
        rbc(res);
    } else
      res.status(401).json({ result: 0, message: "Unauthorized" });
  });

  return router;
};
