# myAPI

## Enter your mysql configuration 

## Running the API
open node.js command prompt <br>
run `npm install`
run `npm start`

## mysql setup
<b>STEPS</b>: 
1. CREATE USER 'foo'@'%' IDENTIFIED WITH mysql_native_password BY 'bar' <br>
2. GRANT ALL PRIVILEGES ON *.* TO 'foo'@'%'
3. Create the database using the query.sql script

# Testing using postman-newman
For testing we will be using newman to make api call 
run `npm test`

