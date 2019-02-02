const mysql = require('mysql');
const express = require('express');
const bodypaser = require('body-parser');
var app = express();

app.use(bodypaser.json());


var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'foo',
    password: 'bar',
    database: 'school'
});

mysqlConnection.connect((err) => {
    if (!err) {
        console.log('DB connection succeded')
    } else {
        console.log('DB connection failed \n Error:' + JSON.stringify(err, undefined, 2))
    }
});

app.listen(3000, () => console.log('Express serevr is running at port no: 3000'))


// Get all relationship
app.get('/relationship', (req, res) => {
    mysqlConnection.query('SELECT * FROM relationship', (err, rows, fields) => {
        if (!err) {
            res.send(rows)
        } else {
            console.log(err)
        }
    })
})


// Register one or more student to a teacher
app.post('/api/register', (req, res) => {
    //let json = req.body;
    let json = req.body
    var teacher_email = json.teacher;
    var student_array = json.students
    var values = []
    for (var i in student_array) {
        values[i] = [teacher_email,student_array[i]]
    }
    var statement = "INSERT INTO `relationship` VALUES ?"
    mysqlConnection.query(statement, [values], (err, rows, fields) => {
        if (err) {
            console.log(err)
        }
    })
})


