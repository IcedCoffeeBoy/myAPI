module.exports = function createSQLTable (mysqlConnection){
    var createRelationship = "CREATE TABLE IF NOT EXISTS `relationship` (" +
        "`teacher` varchar(200) NOT NULL," +
        "`student` varchar(200) NOT NULL," +
        "UNIQUE (`teacher`,`student`))"

    var createStatus = "CREATE TABLE IF NOT EXISTS `status` (" + 
    "`student` varchar(200) NOT NULL," +
        "`suspended` int DEFAULT NULL, " +
        "UNIQUE (`student`))" 

    mysqlConnection.query(createRelationship, (err, rows, fields) => {
        if (!err) {
            console.log("Relationship table will be created by default")
        } else {
            console.log(err)
        }
    })

    mysqlConnection.query(createStatus, (err, rows, fields) => {
        if (!err) {
            console.log("Status table will be created by default")
        } else {
            console.log(err)
        }
    }) 

}

