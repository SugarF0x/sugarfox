const express = require('express'),
      fs      = require('fs'),
      router  = express.Router();

const LocalStrategy     = require('passport-local').Strategy,
      VKontakteStrategy = require('passport-vkontakte').Strategy;


// ---------- ---------- ---------- ---------- ---------- \\

module.exports = (passport) => {
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

    const DEV_IP = '87.228.10.195';

// ---------- ---------- ---------- ---------- ---------- \\

    /* TODO: intorduce bcrypt to local auth process
        > need to add it both to registration and to auth process
    */

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
            callbackURL:  `http://${DEV_IP}:3000/api/passport/login/vk/callback`
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

// ---------- ---------- ---------- ---------- ---------- \\

    router.get('/status', (req,res) => {
        if (req.user) {
            res.json({
                result: 1,
                user: {
                    login: req.user.login,
                    id:    req.user.type +'#'+ req.user.id
                }
            })
        } else {
            res.status(401).json({
                result: 0,
                msg: 'Не произведён вход в профиль'
            })
        }
    });

    router.get('/getUsers', (req,res) => {
        if (!req.user) {
            res.status(401).send({
                result: 0,
                msg: 'Отказано в доступе: войдите в свой профиль для продолжения'
            });
        } else if (req.user.role === 'admin') {
            res.send(users);
        } else {
            res.status(401).send({
                result: 0,
                msg: 'Отказано в доступе: нет прав на это действие'
            });
        }
    });

    router.delete('/logout', ensureAuthenticated, (req, res) => {
        req.logOut();
        res.json({result: 1, msg: 'SUCCESS'})
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
                id: Date.now(),
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

    router.post(
        '/login/vk',
        (req, res, next) => {
            req.session.returnTo = req.body.returnTo;
            return next();
        }, passport.authenticate('vkontakte'));
    router.get('/login/vk/callback', ensureNotAuthenticated, (req, res, next) => {
        passport.authenticate('vkontakte', (err, user, info) => {
            let returnTo = req.session.returnTo;
            delete req.session.returnTo;
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
                return res.redirect(returnTo);
            });
        })(req, res, next);
    });

    router.get('/error', (req, res) => {
        res.send('An error has occured.');
    });

    return router;
};