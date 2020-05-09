module.exports = function(app, router, conn, pre) {
    router.get('/logout', function(req, res) {
        var session = req.session;
        if (session.user) {
            const token = req.cookies.logintoken ? req.cookies.logintoken : "";
            conn.query(
                'DELETE FROM tokens WHERE token=? AND type=0',
                [req.cookies.logintoken], function(err) {
                    res.clearCookie('logintoken');
                    res.redirect(pre.HOST);
                    session.destroy();
                });

        }
    });

}