CREATE DATABASE school;

use school; 

CREATE TABLE IF NOT EXISTS `relationship` (
`teacher` varchar(200) NOT NULL, 
`student` varchar(200) NOT NULL
);

INSERT INTO `relationship` VALUES 
("teacherken@gmail.com","studentjon@example.com"),
("teacherken@gmail.com","studenthon@example.com");