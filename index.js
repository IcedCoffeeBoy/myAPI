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
        console.log('DB connection successful')
    } else {
        console.log('DB connection failed \n Error:' + JSON.stringify(err, undefined, 2))
    }
});

app.listen(3000, () => console.log('Express server is running at port no: 3000'))


// Get all relationship
app.get('/relationship', (req, res) => {
    mysqlConnection.query('SELECT * FROM relationship', (err, rows, fields) => {
        if (!err) {
            res.send(rows)
        } else {
            console.log(err)
            res.status(404).send({message : "MYSQL ERROR"})
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
        values[i] = [teacher_email, student_array[i]]
    }
    var statement = "INSERT INTO `relationship`(teacher,student) VALUES ?"
    mysqlConnection.query(statement, [values], (err, rows, fields) => {
        if (err) {
            console.log(err)
            res.status(404).send({message: "MYSQL ERROR"})
        } else {
            res.sendStatus(204)
        }
    })
})

// Get common students 
app.get('/api/commonstudents/', (req, res) => {
    if (Array.isArray(req.query.teacher)) {
        var len = req.query.teacher.length
        var statement = "SELECT t1.student from ("
        statement = statement + "(SELECT student FROM relationship WHERE teacher=?) as t1"
        for (var i = 0; i < len - 1; i++) {
            var count = i + 2
            statement = statement + " INNER JOIN (SELECT student FROM relationship  WHERE teacher=?) as t" + count.toString() + ""
        }
        statement = statement + " on t1.student=t2.student"
        for (var j = 0; i < len - 2; j++) {
            var num = j + 3
            statement = statement + "AND t1.student=t" + num.toString() + ".student"
        }
        statement = statement + ')'
        params = req.query.teacher
    } else {
        var statement = 'SELECT student FROM relationship WHERE teacher=?'
        params = [req.query.teacher]
    }
    console.log(statement)

    mysqlConnection.query(statement, params, (err, rows, fields) => {
        if (!err) {
            console.log(rows)
            var resultArray = Object.values(JSON.parse(JSON.stringify(rows)))
            var array = []
            for (var key in resultArray) {
                array.push(resultArray[key].student)
            }
            var ret = { student: array }
            res.send(ret)
        } else {
            console.log(err)
            res.status(404).send({"message": "MYSQL ERROR"})
        }
    })
})

// Suspend a student 
// When the student is suspend all records regarding the student will be removed
app.post('/api/suspend', (req, res) => {
    let json = req.body
    var student_email = json.student
    
    var statement = "UPDATE `relationship` SET suspended=1 WHERE student=?"
    mysqlConnection.query(statement, [student_email], (err, rows, fields) => {
        if (err) {
            console.log(err)
            res.status(404).send({message: "MYSQL ERROR"})
        } else {
            console.log(student_email, "removed")
            res.sendStatus(204)
        }
    })
})



