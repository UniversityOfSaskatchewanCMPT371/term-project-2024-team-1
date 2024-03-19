BEGIN;

INSERT INTO User (userId, password, email, clinicName, isAdmin) VALUES ("test12345", "$2a$05$nWO8LNgCKQXnD6oWr3vUAenZB1THK56RqVzzZBCEYtXFl/K3d6KaC", "test@gmail.com", "TestClinic", true);

COMMIT;
