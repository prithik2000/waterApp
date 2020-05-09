module.exports = function(conn) {
    const crypto = require('crypto');
    class Tokenizer {


        static getToken(size) {
            //const token = await
            return crypto.randomBytes(size).toString('hex');
        }

        static async generateUserToken(user, time, type) {
            const token = crypto.randomBytes(48).toString('hex');
            const result = await conn.promise().query('INSERT INTO tokens (selector, token, expires, type, ID) VALUES (?,?,?,?,?)',
                [user.username, token, time, type, user.id]
            );
            return token;
        }

        static async getUserFromToken(token) {
            return null;
        }
    }

    return Tokenizer;
}