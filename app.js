const mysql_config = require('./mysql_config.js')
const createSQLtable = require('./createSQLtable.js')
const mysql = require('mysql');
const express = require('express');
const bodypaser = require('body-parser');

var app = express();
app.use(bodypaser.json());
var mysqlConnection = mysql.createConnection(mysql_config);


/*
Connect to the MYSQL database
Please edit MYSQL config at link: ./mysql_config.js
Default create relationship and status tables if does not exist 
*/
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

app.listen(3000, () => console.log('Express server is running at port no: 3000'))

/* 
Get all relationship between teacher and student 
Headers: authorization: 1234
*/
app.get('/api/relationship', (req, res) => {
    var apiKey = 1234
    if (req.headers.authorization != apiKey) {
        return res.status(401).json({ status: 'error' });
    }

    mysqlConnection.query('SELECT * FROM relationship', (err, rows, fields) => {
        if (!err) {
            res.send(rows)
        } else {
            console.log(err)
            res.status(404).send({ message: "MYSQL ERROR" })
        }
    })
})


// Register a teacher to many student and a student to many teacher
app.post('/api/register', (req, res) => {
    let json = req.body
    var teacher_emails = json.teacher
    var student_emails = json.students

    if (!Array.isArray(teacher_emails)) {
        teacher_emails = [teacher_emails]
    }

    if (!Array.isArray(student_emails)) {
        student_emails = [student_emails]
    }

    if (student_emails.length > 1 && teacher_emails.length > 1) {
        console.log("User attempt to add multiple teachers to multiple students!")
        res.status(404).send({ message: "Unable to add multiple teachers to multiple students" })
        return
    }

    var values = []
    k = 0

    for (var i in teacher_emails) {
        for (var j in student_emails) {
            values[k++] = [teacher_emails[i], student_emails[j]]
        }
    }

    console.log(values)

    var insertRelationship = "INSERT IGNORE INTO `relationship`(teacher,student) VALUES ?"
    mysqlConnection.query(insertRelationship, [values], (err, rows, fields) => {
        if (err) {
            console.log(err)
            res.status(404).send({ message: "MYSQL ERROR" })
        } else {
            res.sendStatus(204)
        }
    })

    var insertStudents = "INSERT IGNORE INTO `status`(student) VALUES ? "
    students_array = []
    for (var k in student_emails) {
        students_array[k] = [student_emails[k]]
    }

    mysqlConnection.query(insertStudents, [students_array], (err, rows, fields) => {
        if (err) {
            console.log(err)
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
        for (var j = 0; j < len - 2; j++) {
            var num = j + 3
            statement = statement + " AND t1.student=t" + num.toString() + ".student"
        }
        statement = statement + ')'
        params = req.query.teacher
    } else {
        var statement = 'SELECT student FROM relationship WHERE teacher=?'
        params = [req.query.teacher]
    }


    mysqlConnection.query(statement, params, (err, rows, fields) => {
        if (!err) {
            var array = toArray(rows)
            var ret = { student: array }
            res.send(ret)
        } else {
            console.log(err)
            res.status(404).send({ "message": "MYSQL ERROR" })
        }
    })
})

// Suspend a student 
app.post('/api/suspend', (req, res) => {
    let json = req.body
    var student_email = json.student

    var statement = "UPDATE `status` SET suspended=1 WHERE student=?"
    mysqlConnection.query(statement, [student_email], (err, rows, fields) => {
        if (err) {
            console.log(err)
            res.status(404).send({ message: "MYSQL ERROR" })
        } else {
            res.sendStatus(204)
        }
    })
})

// Unsuspend a student 
app.post('/api/unsuspend', (req, res) => {
    let json = req.body
    var student_email = json.student

    var statement = "UPDATE `status` SET suspended=null WHERE student=?"
    mysqlConnection.query(statement, [student_email], (err, rows, fields) => {
        if (err) {
            console.log(err)
            res.status(404).send({ message: "MYSQL ERROR" })
        } else {
            res.sendStatus(204)
        }
    })
})


// Get list of suspended students
app.get('/api/suspendedlist/', (req, res) => {
    var statement = "SELECT `student` FROM `status` WHERE suspended is not null"
    mysqlConnection.query(statement, (err, rows, fields) => {
        if (err) {
            console.log(err)
            res.status(404).send({ message: "MYSQL ERROR" })
        } else {
            res.send(rows)
        }
    })
})

// Notification 
app.post('/api/retrievefornotifications/', (req, res) => {
    let json = req.body
    var teacher = json.teacher
    var message = json.notification
    var emails = trimMessage(message)
    var statement = "SELECT t1.student from (" +
        "(SELECT student FROM relationship WHERE teacher=?) as t1 " +
        "INNER JOIN" +
        "(SELECT student FROM status WHERE suspended is null) as t2 " +
        "on t1.student = t2.student)"

    mysqlConnection.query(statement, [teacher], (err, rows, fields) => {
        if (err) {
            console.log(err)
            res.status(404).send({ message: "MYSQL ERROR" })
        } else {
            students = toArray(rows)
            students.forEach((student) => {
                if (!emails.includes(student)) {
                    emails.push(student)
                }
            })
            res.send({ recipients: emails })
        }
    })
})

//Auxillary functions
function trimMessage(msg) {
    var lines = msg.split(" @")
    return lines.slice(1)
}

function toArray(rows) {
    var resultArray = Object.values(JSON.parse(JSON.stringify(rows)))
    var array = []
    for (var key in resultArray) {
        array.push(resultArray[key].student)
    }
    return array
}

module.exports = app 
