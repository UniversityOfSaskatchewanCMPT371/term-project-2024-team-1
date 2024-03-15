/* Replace with your SQL commands */
ALTER TABLE User CHANGE username userId varchar(255) NOT NULL;
ALTER TABLE User DROP FOREIGN KEY user_ibfk_1;
ALTER TABLE User DROP COLUMN clinic_id;
ALTER TABLE User MODIFY COLUMN isAdmin tinyint(1) NOT NULL;

DROP TABLE IF EXISTS VetClinics;