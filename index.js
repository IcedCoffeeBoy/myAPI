const mysql = require('mysql');

var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'foo',
    password: 'bar',
    database: 'TAP'
});

mysqlConnection.connect((err) => {
    if (!err) {
        console.log('DB connection succeded')
    } else {
        console.log('DB connection failed \n Error:' + JSON.stringify(err, undefined, 2))
    }
});