const express        = require('express'),
      app            = express(),
      passport       = require('passport'),
      session        = require('express-session'),
      history        = require('connect-history-api-fallback'),

      routerQuotes   = require('./routers/quotes'),
      routerPassport = require('./routers/passport'),
      routerChat     = require('./routers/chat'),

      moment         = require('moment'),
      methodOverride = require('method-override');

app.use(methodOverride('_method'));
app.use(express.json());

app.use(session({
    secret: 'qkmvGXke3owxWHUMOH1m07sscHsBv3iR7Noy23qoVXC5Lajy5OsCJG27Xde9OR6M',
    resave: false,
    saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/quotes',   routerQuotes(passport));
app.use('/api/passport', routerPassport(passport));
app.use('/api/chat',     routerChat(passport));

const staticFileMiddleware = express.static('dist/public');
app.use(staticFileMiddleware);
app.use(history());
app.use(staticFileMiddleware);

app.listen(3000, () => {
    console.log('--------------------------------------');
    console.log(`[${moment().format('HH:mm:ss')}] Server started at Port 3000\n`);
});