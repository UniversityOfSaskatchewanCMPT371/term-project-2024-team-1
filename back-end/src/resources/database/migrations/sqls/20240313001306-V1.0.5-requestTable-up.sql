/* Replace with your SQL commands */
CREATE TABLE Request (
        id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
        clinicName varchar(255) NOT NULL,
        email varchar(255) NOT NULL,
        password varchar(255) NOT NULL,
        status varchar(255) NOT NULL,
        createdDate DATETIME NOT NULL,
        decisionDate DATETIME NULL,
        requestType varchar(255) NOT NULL
);