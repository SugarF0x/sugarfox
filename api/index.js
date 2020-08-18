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
const express      = require('express');
const consola      = require('consola');
const app          = express();
const bodyParser   = require("body-parser");
const cookieParser = require("cookie-parser");
require('dotenv-defaults').config();

  // HTTPS redirect
if (process.env.PROTOCOL === 'https') {
  let exp = express();
  exp.get('*', (req, res) => {
    res.redirect('https://' + req.headers.host + req.url);
  });
  let rServer = exp.listen(process.env.PORT_HTTP, process.env.LOCAL_MACHINE);
    // prevent duplicate server creation on hot reload
  rServer.on('error', e => {
      rServer.close();
    });
}

/**
 * Establish MongoDB connection
 *
 * @name MongoDB connect
 * @type Database
 */
const mongoose = require('mongoose');
mongoose.Schema.Types.Boolean.convertToFalse.add(""); // for empty value cases

if (process.env.MONGO_DB !== 'false') {
    // prevent duplicate connection on hot reload
  if (!mongoose.connection.readyState) {
    mongoose.connect(process.env.MONGO_DB, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useFindAndModify: true,
      useUnifiedTopology: true
    });

    const db = mongoose.connection;
    db.on("error", error => consola.error(error));
    db.once("open", () => consola.success('Connected to SGFX database'));
  }
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
app.use(cookieParser());

// Require API routes
const routeAuth = require('./routes/auth');

// Import API Routes
app.use('/auth', routeAuth(app));

// Export express app
module.exports = app;
