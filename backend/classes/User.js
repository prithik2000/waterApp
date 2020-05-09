module.exports = function(conn) {

    class User {
        constructor (username, email, id) {
            this.username = username;
            this.email = email;
            this.id = id;
        }

        static async build(username) {
            const result = await conn.promise().query('SELECT * FROM users WHERE username=?', [username]);
            console.log(result);
            if (result.length == 1) {
                const row = result[0][0];
                return new User(row.username, row.email, row.ID);
            } else {
                return null;
            }
        }
    }

    return User;
}
