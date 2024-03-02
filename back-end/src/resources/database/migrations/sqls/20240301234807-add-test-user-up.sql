/* Replace with your SQL commands */
BEGIN;

INSERT INTO VetClinics (clinicName) VALUES ('TestClinic');
INSERT INTO User (username, password, email, clinic_id) VALUES ("test12345", "$2a$05$nWO8LNgCKQXnD6oWr3vUAenZB1THK56RqVzzZBCEYtXFl/K3d6KaC", "test@gmail.com", 1);

COMMIT;