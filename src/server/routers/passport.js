const express = require('express');
const fs = require('fs');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

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
    failureRedirect: '/fail'
    })
);

router.post('/register', (req, res) => {
    let errors = {
        email: [],
        login: [],
        password: [],
        misc: []
    };
    const rex = {
        email: [
            /^([a-z0-9]+[a-z0-9.-]?)*[a-z0-9]@([a-z0-9][-.a-z0-9]?)*[a-z0-9]\.[a-z]{2,4}$/i, // full expression
            [/^[a-z0-9.-]*$/i,                  'Разрешены только латинские буквы, цифры и знаки . и -'],
            [/^[a-z0-9].*$/i,                   'Почта должна начинаться с латинской буквы или цифры'],
            [/^([a-z0-9]+[-.]?)*@.*$/i,         'Повторы специальных знаков в имени запрещены'],
            [/^.*@.*$/i,                        'Почта должна содержать @'],
            [/^.*[a-z0-9]@.*$/i,                'Перед @ должна стоять латинская буква или цифра'],
            [/^.*@[a-z0-9].*$/i,                'Имя домена должно начинаться с латинской буквы или цифры'],
            [/^.*@([a-z0-9]+[-.]?)*.[a-z]*$/i,  'Повторы специальных знаков в домене запрещены'],
            [/^.*\.[a-z]{2,4}$/i,               'Регион должен состоять из 2-4 латинских букв']
        ],
        login: [
            /^[а-яёa-z0-9][а-яёa-z0-9-_]{1,19}[а-яёa-z0-9]$/i, // full expression
            [/^[а-яёa-z0-9].*$/i,   'Логин должен начинаться с буквы или цифры'],
            [/^.[а-яёa-z0-9-_]*$/i, 'Логин должен состоять из букв, цифр и символов - и _'],
            [/^.*[а-яёa-z0-9]$/i,   'Логин должен заканчиваться на букву или цифру'],
            [/^.{3,21}$/,           'Логин должен быть от 3 до 21 символов']
        ],
        password: [
            /^(?=\S+$).{8,}$/, // full expression
            [/^\S+$/,   'Пробелы недопустимы'],
            [/^.{8,}$/, 'Пароль должен быть от 8 символов']
        ]
    };
    let newUser = {
        email: req.body.email.toLowerCase(),
        login: req.body.login,
        password1: req.body.password1,
        password2: req.body.password2
    };

    users.forEach(data => {
        if (data.email === newUser.email) {
            errors.email.push('Эта почта уже зарегистрирована')
        }
    });
    if (newUser.password1 !== newUser.password2) {
        errors.password.push('Пароли не совпадают')
    }
    if (!rex.email[0].test(newUser.email)) {
        rex.email.slice(1).forEach((regexp) => {
            if (!regexp[0].test(newUser.email)) {
                errors.email.push(regexp[1]);
            }
        })
    }
    if (!rex.login[0].test(newUser.login)) {
        rex.login.slice(1).forEach((regexp) => {
            if (!regexp[0].test(newUser.login)) {
                errors.login.push(regexp[1]);
            }
        })
    }
    if (!rex.password[0].test(newUser.password)) {
        rex.password.slice(1).forEach((regexp) => {
            if (!regexp[0].test(newUser.password)) {
                errors.password.push(regexp[1]);
            }
        })
    }

    if (errors.email.length || errors.login.length || errors.password.length || errors.misc.length) {
        console.log(errors);
        res.json({
            result: 0,
            msg: errors
        });
    } else {
        let user = {
            id: Date.now().toString(),
            login: newUser.login,
            email: newUser.email.toLowerCase(),
            password: newUser.password1,
            role: 'default'
        };
        users.push(user);
        fs.writeFile("dist/server/db/user-data.json", JSON.stringify(users), 'utf8', () => {
            console.log(`New user registered: ${user.login}`)
        });
        res.json({result: 1, msg:'SUCCESS'});
    }
});

// ---------- ---------- ---------- ---------- ---------- \\

module.exports = router;