/* Replace with your SQL commands */
CREATE TABLE SurveyCompletionMap (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  surveyId INT NOT NULL,
  FOREIGN KEY (userId) REFERENCES User(id),
  FOREIGN KEY (surveyId) REFERENCES Survey(id)
);