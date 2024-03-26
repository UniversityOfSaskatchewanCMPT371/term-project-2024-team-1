/* Replace with your SQL commands */
BEGIN;
ALTER TABLE Survey
ADD dueDate DATETIME NOT NULL;
COMMIT;