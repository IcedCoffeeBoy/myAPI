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
        values[i] = [teacher_email, student_array[i]]
    }
    var statement = "INSERT INTO `relationship` VALUES ?"
    mysqlConnection.query(statement, [values], (err, rows, fields) => {
        if (err) {
            console.log(err)
        }
    })
})

// Get common students 
app.get('/api/commonstudents/', (req, res) => {
    var statement = 'SELECT student FROM relationship WHERE teacher=?'
    var len = req.query.teacher.length
    if (Array.isArray(req.query.teacher)) {
        var string = ' INTERCEPT SELECT student FROM relationship WHERE teacher=?'
        string = string.repeat(len - 1)
        statement = statement + string 
        params = req.query.teacher
    } else {
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
        }
    })

})


// Old
// Get common students 
app.get('/api/common/', (req, res) => {
    var statement = 'SELECT student FROM relationship WHERE teacher = ?'
    let students = []
    var len = req.query.teacher.length
    for (let i = 0; i < len + 1; i++) {
        mysqlConnection.query(statement, [req.query.teacher[i]], (err, rows, fields) => {
            if (!err) {
                var resultArray = Object.values(JSON.parse(JSON.stringify(rows)))
                var array = []
                for (var key in resultArray) {
                    array.push(resultArray[key].student)
                }
                if (students.length == 0) {
                    students = array
                } else {
                    console.log(array)
                    console.log("students " + students)
                    students = intersect(students, array)
                }

            } else {
                console.log(err)
            }
        })
    }
    var ret = { student: students }
    res.send(ret)
})


function intersect(a, b) {
    var t;
    if (b.length > a.length) t = b, b = a, a = t; // indexOf to loop over shorter
    return a.filter(function (e) {
        return b.indexOf(e) > -1;
    });
}
