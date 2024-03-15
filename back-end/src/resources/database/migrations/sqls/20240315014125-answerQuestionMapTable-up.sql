/* Replace with your SQL commands */
BEGIN;
CREATE TABLE IF NOT EXISTS answerQuestionMap (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rank INT NOT NULL,
    questionID INT NOT NULL,
    userID INT NOT NULL,
    answerID INT NOT NULL,
    FOREIGN KEY (questionID) REFERENCES question(id),
    FOREIGN KEY (userID) REFERENCES User(id),
    FOREIGN KEY (answerID) REFERENCES answer(id)
);
COMMIT;