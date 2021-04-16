const mysql = require('mysql');

//connection config 
const db = mysql.createConnection({
    host: 'sql',
    user: 'root',
    port: '3306',
    password: 'password',
    database: 'optimise',
    multipleStatements: true
});

//connect
db.connect(err => {
    if (err) {
        console.log(`COULDN'T CONNECT:`, err);
    } else {
        console.log('DB CONENCTED');
    }
});

module.exports = db;