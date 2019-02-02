# myAPI
open node.js command prompt <br>
run `node index.js`

# mysql setup
<b>STEPS</b>: 
1. CREATE USER 'foo'@'%' IDENTIFIED WITH mysql_native_password BY 'bar' <br>
2. GRANT ALL PRIVILEGES ON *.* TO 'foo'@'%'
3. Create the database using the query.sql script

# Testing using postman
For testing we will be using postman to make the api call

## User stories 1 
As a teacher, I want to register one or more students to a specified teacher.
![register img](/image/register_postman.png?raw=true)