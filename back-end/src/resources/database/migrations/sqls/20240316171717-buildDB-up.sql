BEGIN;

-- Drop existing tables if they exist
DROP TABLE IF EXISTS UserAnswerMap;
DROP TABLE IF EXISTS SurveyAnswers;
DROP TABLE IF EXISTS SurveyQuestions;
DROP TABLE IF EXISTS User;
DROP TABLE IF EXISTS VetClinics;
DROP TABLE IF EXISTS Request;
DROP TABLE IF EXISTS Survey;
DROP TABLE IF EXISTS Question;
DROP TABLE IF EXISTS ResponseOption;
DROP TABLE IF EXISTS Answer;
DROP TABLE IF EXISTS AnswerQuestionMap;
DROP TABLE IF EXISTS SurveyQuestionMap;

-- Create the User table with unique constraints
CREATE TABLE User (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId VARCHAR(255) NOT NULL,
  password VARCHAR(500) NOT NULL,
  email VARCHAR(255) NOT NULL,
  clinicName VARCHAR(255) NOT NULL,
  isAdmin BOOLEAN NOT NULL
);
ALTER TABLE User ADD UNIQUE (userID);
ALTER TABLE User ADD UNIQUE (email);

-- Create the VetClinics table
CREATE TABLE VetClinics (
  id INT AUTO_INCREMENT PRIMARY KEY,
  clinicName VARCHAR(255) NOT NULL
);

-- Create the Request table
CREATE TABLE Request (
  id INT AUTO_INCREMENT PRIMARY KEY,
  clinicName VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(500) NOT NULL,
  status VARCHAR(255) NOT NULL,
  createdDate DATETIME NOT NULL,
  decisionDate DATETIME NULL,
  requestType VARCHAR(255) NOT NULL
);

-- Create the Survey table
CREATE TABLE Survey (
  id INT AUTO_INCREMENT PRIMARY KEY,
  surveyName VARCHAR(255) NOT NULL,
  dateCreated DATETIME NOT NULL
);

-- Create the Question table with a self-referencing foreign key for parentID
CREATE TABLE Question (
  id INT AUTO_INCREMENT PRIMARY KEY,
  parentID INT NULL,
  questionNumber INT NOT NULL,
  question VARCHAR(500) NOT NULL,
  standard BOOLEAN NOT NULL,
  type VARCHAR(255) NOT NULL
);
ALTER TABLE Question ADD CONSTRAINT fk_parentID FOREIGN KEY (parentID) REFERENCES Question(id);

-- Create the ResponseOption table with a foreign key to Question
CREATE TABLE ResponseOption (
  id INT AUTO_INCREMENT PRIMARY KEY,
  `option` VARCHAR(255) NOT NULL,
  questionID INT NOT NULL,
  FOREIGN KEY (questionID) REFERENCES Question(id)
);

-- Create the Answer table
CREATE TABLE Answer (
  id INT AUTO_INCREMENT PRIMARY KEY,
  answer VARCHAR(255) NOT NULL
);

-- Create the AnswerQuestionMap table with foreign keys to Question, User, and Answer
CREATE TABLE AnswerQuestionMap (
  id INT AUTO_INCREMENT PRIMARY KEY,
  rank INT NOT NULL,
  questionID INT NOT NULL,
  userId INT NOT NULL,
  answerID INT NOT NULL,
  FOREIGN KEY (questionID) REFERENCES Question(id),
  FOREIGN KEY (userId) REFERENCES User(id),
  FOREIGN KEY (answerID) REFERENCES Answer(id)
);

-- Create the SurveyQuestionMap table with foreign keys to Survey and AnswerQuestionMap
CREATE TABLE SurveyQuestionMap (
  id INT AUTO_INCREMENT PRIMARY KEY,
  surveyID INT NOT NULL,
  questionAnswerID INT NOT NULL,
  FOREIGN KEY (surveyID) REFERENCES Survey(id),
  FOREIGN KEY (questionAnswerID) REFERENCES AnswerQuestionMap(id)
);



COMMIT;
