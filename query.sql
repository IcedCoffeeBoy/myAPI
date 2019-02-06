CREATE DATABASE school;

use school; 

CREATE TABLE IF NOT EXISTS `relationship` (
`teacher` varchar(200) NOT NULL, 
`student` varchar(200) NOT NULL,
UNIQUE (`teacher`,`student`)
);

CREATE TABLE IF NOT EXISTS `status` (
 `student` varchar(200) NOT NULL,
 `suspended` int DEFAULT NULL,
 UNIQUE (`student`)
);

