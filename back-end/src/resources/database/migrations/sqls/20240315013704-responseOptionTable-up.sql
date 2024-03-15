/* Replace with your SQL commands */
BEGIN;
CREATE TABLE IF NOT EXISTS responseOption (
    id INT AUTO_INCREMENT PRIMARY KEY,
    `option` VARCHAR(255) NOT NULL,
    questionID INT,
    FOREIGN KEY (questionID) REFERENCES question(id)
);
COMMIT;