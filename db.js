const mysql = require('mysql');
const mysql_config = require('./mysql_config.js');
var createSQLtable = require('./createSQLtable');
var mysqlConnection = mysql.createConnection(mysql_config);


mysqlConnection.connect((err) => {
    if (!err) {
        console.log('DB connection successful')
        //Create required SQL table if missing 
        createSQLtable(mysqlConnection)
    } else {
        console.log('DB connection failed \n Error:' + JSON.stringify(err, undefined, 2))
        console.log('Please ensure you have enter in the correct credentials in mysql_config.js')
    }
});

module.exports = mysqlConnection
