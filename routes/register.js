module.exports = async function (app, router, conn, inc) {
    var bcrypt = require('bcrypt');
    const User = inc.User;
    const Validator = inc.Validator;

    router.get('/register', function (req, res) {
        var session = req.session;
        if (session.user) {
            res.redirect(inc.HOST + "/user/");
        } else {
            res.render('user/register', {
                title: "MC Admin Registration",
                host: inc.HOST,
                session: session
            });
        }
    });

    router.post('/register',
        [
            inc.check('username')
                .isLength({min: 1, max: 20})
                .isAlphanumeric()
                .trim()
                .custom(value => {
                    return Validator.isUsernameTaken(conn, value).then(user => {
                        if (user) {
                            return Promise.reject('E-mail already in use');
                        }
                        return true;
                    })
                })
                .withMessage('Please enter a valid username'),
            inc.check('email')
                .isLength({min: 1, max: 255})
                .isEmail()
                .normalizeEmail()
                .custom(value => {
                    return Validator.isEmailTaken(conn, value).then(user => {
                        if (user) {
                            return Promise.reject('E-mail already in use');
                        }
                        return true;
                    })
                })
                .withMessage('Please enter a valid email'),
            inc.check('password')
                .isLength({min: 8, max: 30})
                .matches('^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$.!%*#?&])[A-Za-z\\d@$.!%*#?&]{8,}$')
                .withMessage('Passwords must be between 8 and 30 characters and contain at least one of each of the following: Uppercase, Lowercase, Number, Special Character'),
            inc.check('confirm-password')
                .isLength({min: 8, max: 30})
                .contains()
                .custom((value, {req}) => {
                    if (value !== req.body.password) {
                        throw new Error('Password confirmation does not match password');
                    }
                    return true;
                })
                .withMessage('Please reenter your password')
        ],
        (req, res) => {
            const errors = inc.validationResult(req);
            var session = req.session;
            if (errors.isEmpty()) {

                bcrypt.genSalt(10, function (err, salt) {
                    if (err) {
                        throw err
                    } else {
                        bcrypt.hash(req.body.password, salt, function(err, hash) {
                            if (err) {
                                throw err
                            } else {
                                conn.query(
                                    'INSERT INTO users (username, email, password) VALUES (?,?,?)',
                                    [req.body.username, req.body.email, hash],
                                    function(err) {
                                        if (err) {
                                            errors.result = true;
                                            send(res, req, errors);
                                        } else {
                                            User.build(req.body.username).then(function(user) {
                                                session.user = user;
                                                session.cookie.maxAge = 3600000;
                                                if (req.body.rememberme) {
                                                    inc.Tokenizer.generateUserToken(user, 30*24*3600*1000 + Date.now(), 0).then(function(token) {
                                                        res.cookie('logintoken', "test", {expire: 30*24*3600*1000 + Date.now()});
                                                        res.redirect(inc.HOST + "/user/");
                                                    });
                                                } else {
                                                    res.redirect(inc.HOST + "/user/");
                                                }
                                            });
                                        }
                                    }
                                )
                            }
                        })
                    }
                });
            } else {
                res.render('user/register', {
                    title: 'MC Admin Register',
                    host: inc.HOST,
                    session: session,
                    errors: errors.array(),
                    data: req.body
                });
            }
        }
    );
}