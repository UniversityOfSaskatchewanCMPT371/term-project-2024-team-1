/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { constructBulkQuery, query } from "@app/adapter/SQLRepositories/SQLConfiguration";
import { SurveyQuestion } from "@app/domain/SurveyQuestion";
import "reflect-metadata";
import { LoggerFactory } from "@app/domain/factory/LoggerFactory";
import { ILogger } from "@app/domain/interfaces/ILogger";
import { ISurveyQuestionRepository } from "@app/domain/interfaces/repositories/ISurveyQuestionRepository";
import { ResultSetHeader } from "mysql2";

export class QuestionSQLRepository implements ISurveyQuestionRepository {
  private readonly _logger: ILogger = LoggerFactory.getLogger(QuestionSQLRepository.name);

  private readonly _getAllQuery: string = "SELECT * FROM Question";
  private readonly _getByQuestionIdQuery: string = "SELECT * FROM Question WHERE id = ?";
  private readonly _getBySurveyQuery: string = "SELECT Q.* FROM Question Q INNER JOIN SurveyQuestionMap SQM ON Q.id = SQM.questionId INNER JOIN Survey S ON SQM.surveyId = S.id WHERE S.surveyName = ?";
  private readonly _createQuestionQuery: string = "INSERT INTO Question (question, standard, type, parentId) VALUES (?, ?, ?, ?);";
  private readonly _updateQuestionQuery: string = "UPDATE Question SET question = ?, standard = ?, type = ?, parentId = ? WHERE id = ?";
  private readonly _deleteQuestionQuery: string = "DELETE FROM Question WHERE id = ?";

  async getAll(): Promise<SurveyQuestion[]> {
    try {
      return query(this._getAllQuery).then((data: [SurveyQuestion[]]) => {
        return data[0];
      });
    } catch (error) {
      this._logger.ERROR(`Failed to retrieve all questions: ${error}`);
      throw error;
    }
  }

  async getBySurvey(surveyName: string): Promise<SurveyQuestion[]> {
    try {
      return query(this._getBySurveyQuery, [surveyName]).then((data: any) => {
        if (data.length === 0) {
          return null;
        }
        return data.map((data: SurveyQuestion[]) => new SurveyQuestion(data[0].id, data[0].question, data[0].standard, data[0].type, data[0].parentId ?? undefined));
      });
    } catch (error) {
      this._logger.ERROR(`Failed to retrieve questions for survey named ${surveyName}: error: ${error}`);
      throw error;
    }
  }

  async create(questions: SurveyQuestion[]): Promise<boolean> {
    const questionFields: any[][] = questions.map((question) => [question.question, (question.standard ? 1 : 0).toString(), question.type, (question.parentId ? Number(question.parentId) : null)]);
    const bulkCreateQuery: string = constructBulkQuery(this._createQuestionQuery, questionFields);
    
    const createAnswers: Promise<boolean> = query(bulkCreateQuery)
      .then((results: ResultSetHeader[]) => {
        const resultSetHeaders: ResultSetHeader[] = [results[0]];
        if (!Array.isArray(resultSetHeaders[0])) {
          // when creating single question
          const resultSetHeader: ResultSetHeader = results[0];
          if (resultSetHeader.affectedRows > 0) {
            this._logger.INFO(`Successfully created the question`);
            return true;
          } 
          this._logger.INFO(`Failed to create the question`);
          return false;
          
        }
        // when creating multiple questions
        const areAllQuestionsCreated: boolean = resultSetHeaders[0]
          .map(resultSetHeaders => resultSetHeaders.affectedRows > 0)
          .every(bool => bool); 
        if (areAllQuestionsCreated) {
          this._logger.INFO(`All questions were created successfully`);
        } else {
          this._logger.INFO(`Not all questions were created successfully`);
        }
        return areAllQuestionsCreated;
        
        
      }).catch((err) => {
        this._logger.ERROR(`Failed to create questions.\nError: ${err}`);
        throw err;
      });

    return createAnswers;
  }

}
