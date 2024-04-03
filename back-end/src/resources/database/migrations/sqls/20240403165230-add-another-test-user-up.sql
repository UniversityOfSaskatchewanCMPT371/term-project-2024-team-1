-- /* Replace with your SQL commands */
BEGIN;

INSERT INTO User (userId, password, email, clinicName, isAdmin) VALUES ("testuser", "$2a$10$HvM1nsH0IJpAfl6mO/xskOfMylVrw8XaYGxJrTCL5pW8zZ2HLN4Pa", "user@gmail.com", "TestUserClinic", false);

COMMIT;
