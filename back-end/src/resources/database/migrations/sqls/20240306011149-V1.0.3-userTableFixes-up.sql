/* Replace with your SQL commands */
/* Replace with your SQL commands */
ALTER TABLE User MODIFY COLUMN isAdmin tinyint(1) NOT NULL DEFAULT 0;
ALTER TABLE User ADD UNIQUE(userId);
ALTER TABLE User ADD UNIQUE(email);