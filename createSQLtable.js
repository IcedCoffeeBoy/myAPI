function createSQLTable(mysqlConnection) {
    var createRelationship = "CREATE TABLE IF NOT EXISTS `relationship` (" +
        "`teacher` varchar(200) NOT NULL," +
        "`student` varchar(200) NOT NULL);"

    var createStatus = "CREATE TABLE IF NOT EXISTS `status` ("
    "`student` varchar(200) NOT NULL," +
        "`suspended` int DEFAULT NULL); "

    mysqlConnection.query(createRelationship, (err, rows, fields) => {
        if (!err) {
            console.log("Sucessfully create relationship table")
        } else {
            console.log(err)
        }
    })

    mysqlConnection.query(createStatus, (err, rows, fields) => {
        if (!err) {
            console.log("Sucessfully create status table")
        } else {
            console.log(err)
        }
    }) 

}

export default createSQLTable;
