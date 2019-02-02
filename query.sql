CREATE DATABASE school;

use school; 

CREATE TABLE IF NOT EXISTS `relationship` (
`teacher` varchar(200) NOT NULL, 
`student` varchar(200) NOT NULL
);

INSERT INTO `relationship` VALUES 
("teacherken@gmail.com","studentjon@example.com"),
("teacherken@gmail.com","studenthon@example.com");

SELECT * FROM common
INNER JOIN
(SELECT student FROM relationship WHERE teacher='teacherken@gmail.com')
INNER JOIN
(SELECT student FROM relationship WHERE teacher='teacherboy@gmail.com'));
