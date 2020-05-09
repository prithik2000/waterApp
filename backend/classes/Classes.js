module.exports = function(conn) {

    /**
     * User Class
     */
    class User {
        constructor (username, email, phone, id) {
            this.username = username;
            this.email = email;
            this.phone = phone;
            this.id = id;
        }

        static async build(username) {
            const result = await conn.promise().query('SELECT * FROM users WHERE username=?', [username]);

            if (result[0].length == 1) {
                const row = result[0][0];
                const u = new User(row.username, row.email, row.phone, row.ID);
                return u;
            } else {
                return null;
            }
        }

        asJSONObject() {
            return JSON.parse(JSON.stringify(this, null ,4));
        }

        asJSONString() {
            return JSON.stringify(this, null ,4);
        }
    }
}
