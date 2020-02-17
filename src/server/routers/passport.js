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

/* TODO:
    > Add validation methods
    > Add FS write to JSON for user data
*/

// ---------- ---------- ---------- ---------- ---------- \\

const users = [];
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

router.get('/status', (req,res) => {
    res.json(req.user)
});

router.get('/getUsers', (req,res) => {
    res.json(users)
});

router.delete('/logout', (req, res) => {
    req.logOut();
    res.status(200).send(JSON.stringify({result: 1, text: 'Logged out'}));
});

router.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/',
    failureFlash: true
    })
);

router.post('/register', (req, res) => {
    try {
        users.push({
            id: Date.now().toString(),
            login: req.body.login,
            email: req.body.email,
            password: req.body.password1
        });
        res.redirect('/');
    } catch {

    }
});

// ---------- ---------- ---------- ---------- ---------- \\

module.exports = router;