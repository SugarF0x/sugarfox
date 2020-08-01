/**
 * Server index script
 *
 * @category server
 * @module index
 *
 * @requires express
 * @requires console
 * @requires nuxt
 * @requires dotenv-defaults
 *
 * @author {@link https://github.com/SugarF0x Sugar_F0x}
 */

const express = require('express');
const consola = require('consola');
const { Nuxt, Builder } = require('nuxt');
const app = express();
const https = require('https');
const bodyParser = require("body-parser");
require('dotenv-defaults').config();

/**
 * Establish MongoDB connection
 *
 * @name MongoDB connect
 * @type Database
 */
const mongoose = require('mongoose');
mongoose.Schema.Types.Boolean.convertToFalse.add(""); // for empty value cases

if (process.env.MONGO_DB !== 'false') {
  mongoose.connect(process.env.MONGO_DB, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: true,
    useUnifiedTopology: true
  });

  const db = mongoose.connection;
  db.on("error", error => consola.error(error));
  db.once("open", () => consola.success('Connected to SGFX database'));
} else {
  consola.info('MongoDB disabled')
}

/**
 * bodyParser and native express JSON parsers
 *
 * @name Body parsers
 */
app.use(bodyParser.json());
app.use(express.json());

/**
 * Routes import
 *
 * @name Routes
 * @type Route
 */
const routeAuth = require("./routes/auth");
app.use("/api/auth", routeAuth(app));

/**
 * Import and Set Nuxt.js options
 *
 * @name Nuxt options
 * @type Nuxt
 */
const config = require('../nuxt.config.js');
config.dev = process.env.NODE_ENV !== 'production';

/**
 * Start server
 *
 * @name Start
 * @function
 * @returns {void}
 */
async function start () {
  // Init Nuxt.js
  const nuxt = new Nuxt(config);

  const { host, port, ssl } = nuxt.options.server;

  await nuxt.ready();
  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt);
    await builder.build();
  }

  // Give nuxt middleware to express
  app.use(nuxt.render);

  if (process.env.PROTOCOL === 'https') {
    // Pass express to https server as well as ssl key and cert
    const httpsOptions = {
      key : ssl.key,
      cert : ssl.cert
    };
    https.createServer(httpsOptions, app)
      .listen(port.https, host);

      // Redirects to HTTPS
    express().get('*', (req, res) => {
      res.redirect('https://' + req.headers.host + req.url);
    })
      .listen(port.http,  host);
  } else {
    // Listen the server as http
    app.listen(port.http, host);
  }
  consola.ready({
    message:
      'Server listening on ' +
      process.env.PROTOCOL + '://' +
      host + ':' +
      (process.env.PROTOCOL === 'https' ? port.https : port.http)
    ,
    badge: true
  });
}

start();
