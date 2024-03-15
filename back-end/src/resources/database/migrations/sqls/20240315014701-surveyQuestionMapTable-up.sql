/* Replace with your SQL commands */
BEGIN;
CREATE TABLE IF NOT EXISTS surveyQuestionMap (
    id INT AUTO_INCREMENT PRIMARY KEY,
    surveyID INT NOT NULL,
    questionAnswerID INT NOT NULL,
    FOREIGN KEY (surveyID) REFERENCES survey(id),
    FOREIGN KEY (questionAnswerID) REFERENCES answerQuestionMap(id)
);
COMMIT;