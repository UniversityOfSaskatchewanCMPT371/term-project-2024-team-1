/* Replace with your SQL commands */
ALTER TABLE User ADD clinicName VARCHAR(255) NOT NULL;

BEGIN;
UPDATE User SET clinicName = 'testClinic' WHERE userId = 'test12345';
COMMIT;