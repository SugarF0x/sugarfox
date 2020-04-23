const express        = require('express'),
      app            = express(),
      passport       = require('passport'),
      session        = require('express-session');

      routerQuotes   = require('./routers/quotes'),
      routerPassport = require('./routers/passport'),

      moment         = require('moment'),
      methodOverride = require('method-override');

/* TODO: Move pass auth here
    > looks like i will have to more passport.authenticate methods here
      though i can still leave all the login and register methods in their separate class
      and just access them via the very same route, just pass (passport) as an argument to the route call
 */

app.use(methodOverride('_method'));
app.use(express.json());
app.use('/', express.static('dist/public'));

app.use(session({
    secret: 'qkmvGXke3owxWHUMOH1m07sscHsBv3iR7Noy23qoVXC5Lajy5OsCJG27Xde9OR6M',
    resave: false,
    saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/quotes', routerQuotes(passport));
app.use('/api/passport', routerPassport(passport));

app.listen(3000, () => {
    console.log('--------------------------------------');
    console.log(`[${moment().format('HH:mm:ss')}] Server started at Port 3000\n`);
});