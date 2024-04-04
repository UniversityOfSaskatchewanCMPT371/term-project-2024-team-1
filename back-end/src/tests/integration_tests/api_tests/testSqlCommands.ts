/* eslint-disable @typescript-eslint/typedef */
const dropTables = `
    DROP TABLE IF EXISTS SurveyQuestionMap;
    DROP TABLE IF EXISTS SurveyCompletionMap;
    DROP TABLE IF EXISTS ResponseOption;
    DROP TABLE IF EXISTS Answer;
    DROP TABLE IF EXISTS Question;
    DROP TABLE IF EXISTS Survey;
    DROP TABLE IF EXISTS User;
`;

const dropUserTable = `
    DROP TABLE IF EXISTS User;
`;

const createUserTable = `
    CREATE TABLE User (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(500) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        clinicName VARCHAR(255) NOT NULL,
        isAdmin BOOLEAN NOT NULL
    );

    INSERT INTO User (userId, password, email, clinicName, isAdmin) VALUES ("test12345", "$2a$05$nWO8LNgCKQXnD6oWr3vUAenZB1THK56RqVzzZBCEYtXFl/K3d6KaC", "test@gmail.com", "TestClinic", true);
`;

const createRequestTable = `
    CREATE TABLE Request (
        id INT AUTO_INCREMENT PRIMARY KEY,
        clinicName VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(500) NOT NULL,
        status VARCHAR(255) NOT NULL,
        createdDate DATETIME NOT NULL,
        decisionDate DATETIME,
        requestType VARCHAR(255) NOT NULL
    );
`;

const createSurveyTable = `
    CREATE TABLE Survey (
        id INT AUTO_INCREMENT PRIMARY KEY,
        surveyName VARCHAR(255) NOT NULL,
        dateCreated DATETIME NOT NULL,
        dueDate DATETIME NULL
    );
`;

const createQuestionTable = `
    CREATE TABLE Question (
        id INT AUTO_INCREMENT PRIMARY KEY,
        parentId INT,
        question VARCHAR(500) NOT NULL,
        standard BOOLEAN NOT NULL,
        type VARCHAR(255) NOT NULL,
        FOREIGN KEY (parentId) REFERENCES Question(id)
    );
`;

const createResponseOptionTable = `
    CREATE TABLE ResponseOption (
        id INT AUTO_INCREMENT PRIMARY KEY,
        \`option\` VARCHAR(255) NOT NULL,
        questionId INT NOT NULL,
        FOREIGN KEY (questionId) REFERENCES Question(id)
    );
`;


const createAnswerTable = `
    CREATE TABLE Answer (
        id INT AUTO_INCREMENT PRIMARY KEY,
        answer VARCHAR(255) NOT NULL,
        questionId INT NOT NULL,
        userId INT NOT NULL,
        FOREIGN KEY (questionId) REFERENCES Question(id),
        FOREIGN KEY (userId) REFERENCES User(id),
        note VARCHAR(1024) NULL
    );
`;

const createSurveyQuestionMapTable = `
    CREATE TABLE SurveyQuestionMap (
        id INT AUTO_INCREMENT PRIMARY KEY,
        surveyId INT NOT NULL,
        questionId INT NOT NULL,
        rankOrder INT NOT NULL,
        FOREIGN KEY (surveyId) REFERENCES Survey(id),
        FOREIGN KEY (questionId) REFERENCES Question(id)
    );
`;

const createSurveyCompletionMapTable = `
    CREATE TABLE SurveyCompletionMap (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL,
        surveyId INT NOT NULL,
        FOREIGN KEY (userId) REFERENCES User(id),
        FOREIGN KEY (surveyId) REFERENCES Survey(id)
    );
`;


const createTables: any = `
    ${createSurveyTable}
    ${createQuestionTable}
    ${createAnswerTable}
    ${createResponseOptionTable}
    ${createSurveyCompletionMapTable}
    ${createSurveyQuestionMapTable}
`;

const createSurvey = `
    INSERT INTO Survey (surveyName, dateCreated, dueDate) VALUES (?, ?, ?);
`;


const createUser = `
    INSERT INTO User (userId, password, email, clinicName, isAdmin) VALUES (?, ?, ?, ?, ?);
`;

const createRequest = `
    INSERT INTO Request (clinicName, email, password, status, createdDate, decisionDate, requestType) VALUES (?, ?, ?, ?, ?, ?, ?);
`;

const createQuestion = `
    INSERT INTO Question (parentId, question, standard, type) VALUES (?, ?, ?, ?);
`;

const createResponseOption = `
    INSERT INTO ResponseOption (\`option\`, questionId) VALUES (?, ?);
`;

const createAnswer = `
    INSERT INTO Answer (answer, questionId, userId, note) VALUES (?, ?, ?, ?);
`;

const createSurveyQuestionMap = `
    INSERT INTO SurveyQuestionMap (surveyId, questionId, rankOrder) VALUES (?, ?, ?);
`;

const createSurveyCompletionMap = `
    INSERT INTO SurveyCompletionMap (userId, surveyId) VALUES (?, ?);
`;



module.exports = {
  createSurvey,
  createUser,
  createRequest,
  createQuestion,
  createResponseOption,
  createAnswer,
  createSurveyQuestionMap,
  createSurveyCompletionMap,
  dropTables,
  dropUserTable,
  createTables,
  createUserTable,
  createRequestTable,
  createSurveyTable,
  createQuestionTable,
  createResponseOptionTable,
  createAnswerTable,
  createSurveyQuestionMapTable
};
