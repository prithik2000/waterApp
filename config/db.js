module.exports = function(mysql, env) {
    const pool = mysql.createPool({
        host: env.DBHOST,
        user: env.DBUSER,
        password: env.DBPASSWORD,
        database: env.DBNAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });

    /*pool.connect(function(err){
        if(!err) {
            console.log("Database is connected ... \n\n");
        } else {
            console.log("Error connecting database ... \n\n");
        }
    });*/

    return pool;
}

