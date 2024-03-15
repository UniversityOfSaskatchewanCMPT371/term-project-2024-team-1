/* Replace with your SQL commands */
BEGIN;
CREATE TABLE IF NOT EXISTS question (
    id INT AUTO_INCREMENT PRIMARY KEY,
    parentId INT,
    questionNumber INT NOT NULL,
    question VARCHAR(500) NOT NULL,
    `standard` BOOLEAN NOT NULL,
    `type` VARCHAR(255) NOT NULL
);
COMMIT;