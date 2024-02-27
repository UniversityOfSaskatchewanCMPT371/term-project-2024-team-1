BEGIN;

CREATE TABLE IF NOT EXISTS VetClinics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    clinicName VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS User (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    isAdmin BOOLEAN DEFAULT FALSE,
    clinic_id INT,
    FOREIGN KEY (clinic_id) REFERENCES VetClinics(id)
);


CREATE TABLE IF NOT EXISTS SurveyQuestions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS SurveyAnswers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    answer VARCHAR(255) NOT NULL,
    question_id INT,
    note VARCHAR(255) NULL,
    FOREIGN KEY (question_id) REFERENCES SurveyQuestions(id)
);

CREATE TABLE IF NOT EXISTS UserAnswerMap (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    answer_id INT,
    FOREIGN KEY (user_id) REFERENCES User(id),
    FOREIGN KEY (answer_id) REFERENCES SurveyAnswers(id)
);


COMMIT;