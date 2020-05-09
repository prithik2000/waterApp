module.exports = function(app, router, conn, pre) {
    router.get('/', function(req, res) {
        var session = req.session;
        res.render('layout', {title: "MC Admin", host: pre.HOST, session: session });
    });

    router.get('/index', function(req, res) {
        var session = req.session;
        res.render('layout', {title: "MC Admin", host: pre.HOST, session: session });
    });
}





/*const express = require('express');
const {check, validationResult} = require('express-validator');

const router = express.Router();

router.post('/',
    [
        check('name')
            .isLength({min: 1})
            .withMessage('Please enter a name'),
        check('email')
            .isLength({min: 1})
            .withMessage('Please enter an email'),
    ],
    (req, res) => {
        const errors = validationResult(req);

        if (errors.isEmpty()) {
            res.send('Thank you for your registration!');
        } else {
            res.render('form', {
                title: 'Registration form',
                errors: errors.array(),
                data: req.body,
            });
        }
    }
);

router.get('/', (req, res) => {
    var session = req.session
    res.render('form', {title: 'MC Admin', host: 'http://localhost:3000', session:req.session});
});

router.get('/login', (req, res) => {
    var session = req.session
    res.render('user/login', {host: 'http://localhost:3000', session: session})
});

module.exports = router;*/