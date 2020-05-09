module.exports = function(conn) {
    require('dotenv').config();

    const HOST = process.env.HOST;

    var bcrypt = require('bcrypt');

    const {check, validationResult} = require('express-validator');
    const Validator = require('./backend/util/Validator');
    const Tokenizer = require('./backend/util/Tokenizer')(conn);

    const User = require('./backend/classes/User')(conn);

    const users = require('./backend/util/users');

    return {
        HOST: HOST,
        check: check,
        validationResult: validationResult,
        Validator: Validator,
        Tokenizer: Tokenizer,
        bcrypt: bcrypt,
        User: User,
        users: users
    };
}