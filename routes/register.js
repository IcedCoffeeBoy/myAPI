var express = require('express');
var router = express.Router();
var mysqlConnection = require('../db');

router.post('/', (req, res) => {

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
}
);

module.exports = router;
