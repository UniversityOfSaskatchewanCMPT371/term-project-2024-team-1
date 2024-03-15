/* Replace with your SQL commands */
BEGIN;
ALTER TABLE User ADD agreeToEthics BOOLEAN NOT NULL;

DROP TABLE IF EXISTS UserAnswerMap;

DROP TABLE IF EXISTS SurveyAnswers;

DROP TABLE IF EXISTS SurveyQuestions;

COMMIT;