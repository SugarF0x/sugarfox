const express = require('express'),
    fs      = require('fs'),
    router  = express.Router(),
    session = require('express-session');

const passport          = require('passport'),
    LocalStrategy     = require('passport-local').Strategy,
    VKontakteStrategy = require('passport-vkontakte').Strategy;

const users = {local: [], VK: []};
fs.readFile('dist/server/db/user-data.json', 'utf8', (err, data) => {
    if (!err) {
        let ud = JSON.parse(data);
        ud.local.forEach((entry) => {
            users.local.push(entry)
        });
        ud.VK.forEach((entry) => {
            users.VK.push(entry)
        })
    }
});

const SESSION_SECRET = 'qkmvGXke3owxWHUMOH1m07sscHsBv3iR7Noy23qoVXC5Lajy5OsCJG27Xde9OR6M';

// ---------- ---------- ---------- ---------- ---------- \\

passport.use(new LocalStrategy({usernameField: 'email'}, (email, password, done) => {
    const user = users.local.find(user => user.email === email);
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
}));

passport.use(new VKontakteStrategy({
        clientID:     7123145,
        clientSecret: 'EDY6yy6bfCPtTkPk8bKe',
        callbackURL:  "http://localhost:3000/api/passport/login/vk/callback"
    },
    function(accessToken, refreshToken, params, user, done) {
        process.nextTick(() => {
            const oldUser = users.VK.find(oldUser => oldUser.id === user.id);
            if (oldUser) {
                return done(null, oldUser);
            }

            let firstTime = {
                type: 'VK',
                id:    user.id,
                login: user.displayName,
                role: 'default'
            };
            users.VK.push(firstTime);
            fs.writeFile("dist/server/db/user-data.json", JSON.stringify(users), 'utf8', () => {
                console.log(`New VK user registered: ${firstTime.login}`)
            });
            return done(null, firstTime);
        });
    }
));

passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((obj, done) => {
    done(null, obj);
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(null); }
    res.redirect('/error')
}

function ensureNotAuthenticated(req, res, next) {
    if (!req.isAuthenticated()) { return next(null); }
    res.redirect('/error')
}

// ---------- ---------- ---------- ---------- ---------- \\

router.use(express.urlencoded({ extended: false }));
router.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
router.use(passport.initialize());
router.use(passport.session());

// ---------- ---------- ---------- ---------- ---------- \\

router.get('/',
    function(req, res) { // TODO: Passport API documentation
        res.send('TODO: Passport API documentation');
    });

router.get('/status', (req,res) => {
    res.json(req.user)
});

router.get('/getUsers', (req,res) => {
    res.json(users)
});

router.delete('/logout', ensureAuthenticated, (req, res) => {
    req.logOut();
    res.redirect('/');
});

// ---------- ---------- ---------- ---------- ---------- \\

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
            [/^[a-z0-9.-@]*$/i,                 'Разрешены только латинские буквы, цифры и знаки . и -'],
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

    users.local.forEach(data => {
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
        res.json({result: 0, msg: errors});
    } else {
        let user = {
            type: 'local',
            id: Date.now().toString(),
            login: newUser.login,
            email: newUser.email.toLowerCase(),
            password: newUser.password1,
            role: 'default'
        };
        users.local.push(user);
        fs.writeFile("dist/server/db/user-data.json", JSON.stringify(users), 'utf8', () => {
            console.log(`New Local user registered: ${user.login}`)
        });
        res.json({result: 1, msg:'SUCCESS'});
    }
});

// ---------- ---------- ---------- ---------- ---------- \\

router.post('/login/local', ensureNotAuthenticated, (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.json({result: 0, msg: 'Неправильно введена почта или пароль'});
        }
        req.logIn(user, err => {
            if (err) {
                return next(err);
            }
            return res.json({result: 1, msg: 'SUCCESS'});
        });
    })(req, res, next);
});

router.get('/login/vk', passport.authenticate('vkontakte'));
router.get('/login/vk/callback', ensureNotAuthenticated, (req, res, next) => {
    passport.authenticate('vkontakte', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.redirect('/error');
        }
        req.logIn(user, err => {
            if (err) {
                return next(err);
            }
            return res.redirect('/');
        });
    })(req, res, next);
});

router.get('/error', (req, res) => {
    res.send('An error has occured.');
});

// ---------- ---------- ---------- ---------- ---------- \\

module.exports = router;