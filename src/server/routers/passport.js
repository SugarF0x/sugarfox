const express = require('express');
const fs = require('fs');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const flash = require('express-flash');

// ---------- ---------- ---------- ---------- ---------- \\

function initialize(passport, getUserByEmail, getUserById) {
    const authenticateUser = (email, password, done) => {
        const user = getUserByEmail(email);
        if (user == null) {
            return done(null, false, { message: 'No user with that email' })
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

    passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));
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
*/

// ---------- ---------- ---------- ---------- ---------- \\

const users = [];
fs.readFile('dist/server/db/user-data.json', 'utf8', (err, data) => {
    if(!err) {
        JSON.parse(data).forEach((entry) => {users.push(entry)})
    }
});

const SESSION_SECRET = 'qkmvGXke3owxWHUMOH1m07sscHsBv3iR7Noy23qoVXC5Lajy5OsCJG27Xde9OR6M';

initialize(
    passport,
    email => users.find(user => user.email === email),
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
    res.redirect('/');
});

router.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/fail',
    failureFlash: true
    })
);

router.post('/register', (req, res) => {
    try {
        let newUser = {
            id: Date.now().toString(),
            login: req.body.login,
            email: req.body.email,
            password: req.body.password1,
            role: 'default'
        };
        users.push(newUser);
        fs.writeFile("dist/server/db/user-data.json", JSON.stringify(users), 'utf8', () => {
            console.log('user-data updated')
        });
        res.redirect('/');
    } catch {

    }
});

// ---------- ---------- ---------- ---------- ---------- \\

module.exports = router;