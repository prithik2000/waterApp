const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const redis = require('redis');
const redisClient = redis.createClient();
const redisStore = require('connect-redis')(session);
const mysql = require('mysql2');
const env = process.env;
const conn = require('./config/db')(mysql, env);
while (!conn) {
}
const fs = require('fs');
const app = express();
const util = require('./util')(conn);
const path = require('path');
const routes = require('./routes/index');

redisClient.on('error', (err) => {
    console.log('Redis error: ', err);
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(session({
    secret: 'ThisIsHowYouUseRedisSessionStorage',
    name: '_MCADMIN',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Note that the cookie-parser module is no longer needed
    store: new redisStore({ host: 'localhost', port: 6379, client: redisClient, ttl: 86400 }),
}));

app.use((req, res, next) => {
    if (req.cookies.user_sid && !req.session.user) {
        res.clearCookie('user_sid');
    }
    next();
});

app.use((req, res, next) => {
    if (!req.session.user && req.cookies.logintoken) {
        util.Tokenizer.getUserFromToken(req.cookies.logintoken).then(function(user) {
            req.session.user = user;
        });
    } else {
        next();
    }
});

app.use((req, res, next) => {
    if(req.session.user && !util.users[req.session.id] ) {
        util.users[req.session.id] = new util.User(req.session.user.username, req.session.user.email, req.session.user.id);

        // Unsure if below is thread safe and doesnt result in race conditions
        /*util.User.build(req.session.user.username).then(function(user) {
            util.users[req.session.id] = user;
        });*/
    }
    return next();
});

// Initialize ALL routes including subfolders

function recursiveRoutes(folderName) {
    fs.readdirSync(folderName).forEach(function(file) {

        var fullName = path.join(folderName, file);
        var stat = fs.lstatSync(fullName);

        if (stat.isDirectory()) {
            recursiveRoutes(fullName);
        } else if (file.toLowerCase().indexOf('.js')) {
            require('./' + fullName)(this, app, conn, util);
            console.log("require('" + fullName + "')");
        }
    });
}
recursiveRoutes('routes');

app.use(function (req, res, next) {
    res.status(404).render('404', {
        title: 'MC Admin 404',
        host: util.HOST,
        session: req.session
    });
});

module.exports = app;