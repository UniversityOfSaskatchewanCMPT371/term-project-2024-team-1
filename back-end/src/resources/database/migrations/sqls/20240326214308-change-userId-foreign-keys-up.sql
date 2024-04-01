DROP PROCEDURE IF EXISTS AnswerUserIdProc;
DROP PROCEDURE IF EXISTS SurveyCompletionMapUserIdProc;

CREATE PROCEDURE AnswerUserIdProc()
BEGIN
    DECLARE constraintCount INT;

    SELECT COUNT(*)
    INTO constraintCount
    FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
    WHERE CONSTRAINT_NAME = 'answer_ibfk_2';

    IF constraintCount > 0 THEN
        ALTER TABLE Answer DROP FOREIGN KEY `answer_ibfk_2`;
        ALTER TABLE Answer MODIFY userId varchar(255) NOT NULL;
        ALTER TABLE Answer ADD CONSTRAINT fk_userId FOREIGN KEY (userId) REFERENCES User(userId);
    ELSE
        SELECT "answer_ibfk_2 doesnt exist, skipping" as "return_message";
    END IF;
END;

CREATE PROCEDURE SurveyCompletionMapUserIdProc()
BEGIN
    DECLARE constraintCount INT;

    SELECT COUNT(*)
    INTO constraintCount
    FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
    WHERE CONSTRAINT_NAME = 'surveycompletionmap_ibfk_1';

    IF constraintCount > 0 THEN

        ALTER TABLE SurveyCompletionMap DROP FOREIGN KEY `surveycompletionmap_ibfk_1`;
        ALTER TABLE SurveyCompletionMap MODIFY userId varchar(255) NOT NULL;
        ALTER TABLE SurveyCompletionMap ADD CONSTRAINT surveycompletionmap_fk_userId FOREIGN KEY (userId) REFERENCES User(userId);
    ELSE
        SELECT "surveycompletionmap_ibfk_1 doesnt exist, skipping" as "return_message";
    END IF;
END;

CALL AnswerUserIdProc();
CALL SurveyCompletionMapUserIdProc();