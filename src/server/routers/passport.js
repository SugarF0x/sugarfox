const express = require('express');
const fs = require('fs');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const flash = require('express-flash');

// ---------- ---------- ---------- ---------- ---------- \\

function initialize(passport, getUserByLogin, getUserById) {
    const authenticateUser = (login, password, done) => {
        const user = getUserByLogin(login);
        if (user == null) {
            return done(null, false, { message: 'No user with that login' })
        }

        try {
            if (password === user.password) {
                return done(null, user)
            } else {
                return done(null, false, { message: 'Password incorrect' })
            }
        } catch (e) {
            return done(e)
        }
    };

    passport.use(new LocalStrategy({ usernameField: 'login' }, authenticateUser));
    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser((id, done) => {
        return done(null, getUserById(id))
    })
}

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/')
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    next()
}

// ---------- ---------- ---------- ---------- ---------- \\

const users = [{"id":"1581940179723","login":"w","email":"w@w","password":"123"}];
const SESSION_SECRET = 'qkmvGXke3owxWHUMOH1m07sscHsBv3iR7Noy23qoVXC5Lajy5OsCJG27Xde9OR6M';

initialize(
    passport,
    login => users.find(user => user.login === login),
    id => users.find(user => user.id === id)
);

router.use(express.urlencoded({ extended: false }));
router.use(flash());
router.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
router.use(passport.initialize());
router.use(passport.session());

// ---------- ---------- ---------- ---------- ---------- \\

router.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/success',
    failureRedirect: '/fail',
    failureFlash: true
    }),
    (req, res) => {
        res.send('success')
    }
);

router.post('/register', (req, res) => {
    try {
        users.push({
            id: Date.now().toString(),
            login: req.body.login,
            email: req.body.email,
            password: req.body.password1
        });
        res.json(users);
    } catch {
        res.redirect('/register')
    }
});

// ---------- ---------- ---------- ---------- ---------- \\

module.exports = router;