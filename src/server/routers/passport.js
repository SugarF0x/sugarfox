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

router.get('/register', (req, res) => {
    let errors = {
        email: [],
        login: [],
        password: [],
        misc: []
    };
    const rex = {
        email: [
            /^[a-z0-9]([a-z0-9]+[a-z0-9._-])+[a-z0-9]@([a-z0-9][-a-z0-9]+\.)+[a-z]{2,4}$/i, // full expression
            [/^[a-z0-9].*$/i,                   'Почта должна начинаться с латинской буквы или цифры'],
            [/^.([a-z0-9]+[a-z0-9._-])+.*$/i,   'Запрещены повторы специальных символов (.. -- __)'],
            [/^.*@.*$/,                         'Почта должна содержать @'],
            [/^.*[a-z0-9]@.*$/i,                'Перед @ должна стоять латинская буква или цифра'],
            [/^.*@([a-z0-9][-a-z0-9]+\.)+.*$/i, 'Поле домена не должно содержать специальных смволов и повторов точек (..)'],
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

    const loginRegExp = /^[а-яА-ЯёЁa-zA-Z][а-яА-ЯёЁa-zA-Z0-9-_]{2,20}$/;
    const passRegExp = /^(?=\S+$).{8,}$/;
    const mailRegExp = /^[a-zA-Z0-9]([a-zA-Z0-9]+[a-zA-Z0-9._-])+[a-zA-Z0-9]@([A-z0-9][-A-z0-9]+\.)+[A-z]{2,4}$/;

    users.forEach((data) => {
        if (data.email === newUser.email) {
            errors.email.push('Эта почта уже зарегистрирована')
        }
    });

    if (newUser.password1 !== newUser.password2) {
        errors.password.push('Пароли не совпадают')
    }

    /* TODO:
        > Make these validations check for each individual case
        > Split the error message into different texts so as to be more clear with error description
     */

    // if (!loginRegExp.test(newUser.login)) {
    //     errors.login.push('Логин должен содержать от 3 до 20 символов и не содержать пробелов и специальных символов кроме - и _')
    // }
    //
    // if (!passRegExp.test(newUser.password1)) {
    //     errors.password.push('Пароль должен быть от 8 символов и больше и не содержать в себе пробелов')
    // }
    //
    // if (!mailRegExp.test(newUser.email)) {
    //     errors.email.push('Неправильно введена почта')
    // }

    rex.email.forEach((regexp) => {

    })

    /* TODO:
        > Send errors in response if any
     */
});

router.post('/register', (req, res) => {
    try {
        let newUser = {
            id: Date.now().toString(),
            login: req.body.login,
            email: req.body.email.toLowerCase(),
            password: req.body.password1,
            role: 'default'
        };
        users.push(newUser);
        fs.writeFile("dist/server/db/user-data.json", JSON.stringify(users), 'utf8', () => {
            console.log(`New user registered: ${newUser.login}`)
        });
        res.redirect('/');
    } catch {
        console.log('Registration error caught (???)')
    }
});

// ---------- ---------- ---------- ---------- ---------- \\

module.exports = router;