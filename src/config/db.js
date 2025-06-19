let mysql = require("mysql2");
require("dotenv").config({ path: __dirname + "/../../.env" });

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,         // adjust based on expected load
    queueLimit: 0,
    multipleStatements: true
});

pool.getConnection((err, connection) => {
    if (err) {
        console.error("Database not connected:", err.message);
    } else {
        console.log("Database connected");
        connection.release(); // release the test connection
    }
});

module.exports = pool;
