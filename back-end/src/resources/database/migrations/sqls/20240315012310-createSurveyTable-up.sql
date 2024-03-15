/* Replace with your SQL commands */
BEGIN;
CREATE TABLE IF NOT EXISTS survey (
    id INT AUTO_INCREMENT PRIMARY KEY,
    surveyName VARCHAR(255) NOT NULL,
    dateCreated VARCHAR(255) NOT NULL
);
COMMIT;