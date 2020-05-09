module.exports = function(app, router, conn, inc) {
    var bcrypt = inc.bcrypt;
    const User = inc.User;

    router.get('/login', function(req, res) {
        var session = req.session;
        if (session.user) {
            res.redirect(inc.HOST + "/user/");
        } else {
            res.render('user/login', {
                title: "MC Admin",
                host: inc.HOST,
                session: session
            });
        }
    });

    router.post('/login',
        [
            inc.check('username')
                .isLength({min: 1, max: 20})
                .isAlphanumeric()
                .withMessage('Please enter your username'),
            inc.check('password')
                .isLength({min: 8})
                .withMessage('Please enter your password'),
        ],
        (req, res) => {
            const errors = inc.validationResult(req);
            var session = req.session;

            if (errors.isEmpty()) {
                conn.query(
                    'SELECT * FROM users WHERE username=?',
                    [req.body.username],
                    function(err, result, fields) {
                        console.log(err);
                        if (result.length == 1) {
                            Object.keys(result).forEach(function(key) {
                                var row = result[key];

                                row.password = row.password.replace('$2y$', '$2a$');
                                bcrypt.compare(req.body.password, row.password, async function (err, correct) {
                                    if (correct) {
                                        User.build(req.body.username).then(function(user) {
                                            session.user = user;
                                            session.cookie.maxAge = 3600000;
                                            if (req.body.rememberme) {
                                                inc.Tokenizer.generateUserToken(user, 30*24*3600*1000 + Date.now(), 0).then(function(token) {
                                                    res.cookie('logintoken', token, {expire: 30*24*3600*1000 + Date.now()});
                                                    res.redirect(inc.HOST + "/user/");
                                                });
                                            } else {
                                                res.redirect(inc.HOST + "/user/");
                                            }
                                        });
                                    } else {
                                        errors.result = false;
                                        send(res, req, errors);
                                    }
                                });
                            });
                        } else {
                            errors.result = false;
                            send(res, req, errors);
                        }

                    }
                );
            } else {
                res.render('user/login', {
                    title: 'MC Admin Login',
                    host: inc.HOST,
                    session: session,
                    errors: errors.array(),
                    data: req.body
                });
            }
        }
    );

    function send(res, req, errors) {
        res.render('user/login', {
            title: 'MC Admin Login',
            host: inc.HOST,
            session: req.session,
            errors: errors.array(),
            data: req.body
        });
    }
}