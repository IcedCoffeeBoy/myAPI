let array = []
var arr2 = []
for(var i = 0;i < 10;i++){
    arr2 = []
    arr2[1] =1 
    array= arr2
}

console.log(array)


// Old
// Get common students 
app.get('/api/common/', (req, res) => {
    var statement = 'SELECT student FROM relationship WHERE teacher = ?'
    let students = []
    var len = req.query.teacher.length
    for (let i = 0; i < len; i++) {
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
