class Validator {
    static async isUsernameAvailable(conn, username) {
        return await !isUsernameTaken(conn, username);
    }

    static async isUsernameTaken(conn, username) {
        /*const result = await conn.query('SELECT * FROM users WHERE username=?', [username]);
        console.log(result);
        return result[0].length == 1;*/
        const result = await conn.promise().query('SELECT * from users WHERE username=?', [username]);
        if (!result[0].length < 1) {
            throw new Error('Post with this id was not found');
        }
        return result[0][0] != null;
        /*conn.query(
            'SELECT * FROM users WHERE username=?',
            [username],
            function(err, result, fields) {
                console.log(result);
                if (result.length == 1) {
                    return true;
                } else {
                    return false;
                }
            }
        );*/
    }

    static async isEmailAvailable(conn, username) {
        return await !isEmailTaken(conn, username);
    }

    static async isEmailTaken(conn, email) {
        const result = await conn.promise().query('SELECT * FROM users WHERE email=?', [email]);
        return result[0].length == 1;
        /*conn.query(
            'SELECT * FROM users WHERE email=?',
            [email],
            function(err, result, fields) {
                if (result.length == 1) {
                    return true;
                } else {
                    return false;
                }
            }
        );*/
    }
}

module.exports = Validator

