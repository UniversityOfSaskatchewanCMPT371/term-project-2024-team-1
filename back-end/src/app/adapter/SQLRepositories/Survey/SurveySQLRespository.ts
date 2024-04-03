import { constructBulkQuery, query } from "@app/adapter/SQLRepositories/SQLConfiguration";
import { Survey } from "@app/domain/Survey";
import "reflect-metadata";
import { ISurveyRepository } from "@app/domain/interfaces/repositories/ISurveyRepository";
import { formatDateForSQL } from "@app/application/util";
import { ILogger } from "@app/domain/interfaces/ILogger";
import { LoggerFactory } from "@app/domain/factory/LoggerFactory";
import { SurveyResponse } from "@app/domain/SurveyResponse";
import { QuestionToAddDTO } from "@app/adapter/DTOs/QuestionToAddDTO";
import { ResultSetHeader } from "mysql2";

export class SurveySQLRepository implements ISurveyRepository {

  private readonly _logger: ILogger = LoggerFactory.getLogger(SurveySQLRepository.name);

  private readonly _getAllQuery: string = "SELECT * FROM Survey;";
  private readonly _getSurveyQuery: string = "SELECT * FROM Survey WHERE id = ?;";
  private readonly _createSurveyQuery: string = "INSERT INTO Survey (surveyName, dateCreated, dueDate) VALUES (?, NOW(), ?);";
  private readonly _deleteSurveyQuery: string = "DELETE FROM Survey WHERE id = ?;";
  private readonly _addQuestionToSurveyQuery: string = "INSERT INTO SurveyQuestionMap (surveyId, questionId, rankOrder) VALUES (?, ?, ?);";
  private readonly _getUsersCompletedSurvey: string = "SELECT userId FROM SurveyCompletionMap WHERE surveyId = ?;";
  private readonly _getUsersNotCompletedSurvey: string = "SELECT User.userId FROM User WHERE NOT EXISTS ( SELECT * FROM SurveyCompletionMap WHERE SurveyCompletionMap.userId = User.userId AND SurveyCompletionMap.surveyId = ?);";
  private readonly _getAllSurveyResponse: string = `  SELECT Q.question AS question, A.answer AS answer, A.userId AS userId , A.note AS note 
                                                      FROM 
                                                          Question AS Q
                                                      INNER JOIN 
                                                          Answer AS A ON Q.id = A.questionId
                                                      INNER JOIN 
                                                          SurveyQuestionMap AS SQM ON Q.id = SQM.questionId
                                                      WHERE 
                                                          SQM.surveyId = ?
                                                      ORDER BY 
                                                          userId,
                                                          CASE
                                                              WHEN Q.parentId IS NULL THEN SQM.rankOrder
                                                              ELSE (SELECT rankOrder FROM SurveyQuestionMap WHERE questionId = Q.parentId)
                                                          END,
                                                          CASE
                                                              WHEN Q.parentId IS NULL THEN 0
                                                              ELSE 1
                                                          END,
                                                          SQM.rankOrder;`;

  async getAll(): Promise<Survey[]> {
    try {
      const [data] = await query(this._getAllQuery);
      return data;
    } catch (error) {
      return Promise.reject(error);
      
    }
  }

  async getSurvey(surveyId: number): Promise<Survey | null> {
    try {
      const [data] = await query(this._getSurveyQuery, [surveyId.toString()]);
      if (data.length === 0) {
        return null;
      }
      return data[0]; 
    } catch (error: any) {
      this._logger.ERROR(`error: ${error}`);
      return Promise.reject(error);
    }
  }

  async getUsersCompletedSurvey(surveyId: number): Promise<string[] | null> {
    try {
      return query(this._getUsersCompletedSurvey, [surveyId.toString()]).then((result: [string[]]) => {
        return result[0];
      }).catch((error) => {
        throw error;
      });
    } catch (error: any) {
      this._logger.ERROR(`error: ${error}`);
      return Promise.reject(error);
    }
  }

  async getUsersNotCompletedSurvey(surveyId: number): Promise<string[] | null> { 
    try {
      return query(this._getUsersNotCompletedSurvey, [surveyId.toString()]).then((result: [string[]]) => {
        return result[0];
      });
    } catch (error: any) {
      this._logger.ERROR(`error: ${error}`);
      return Promise.reject(error);
    }
  }

  async createSurvey(survey: Survey): Promise<boolean> {
    try {
      const dueDate: string = formatDateForSQL(new Date(survey.dueDate));
      const [result] = await query(this._createSurveyQuery, [survey.surveyName, dueDate]);
      return result.affectedRows > 0;
    } catch (error: any) {
      this._logger.ERROR(`error: ${error}`);
      return Promise.reject(error);
    }
  }

  async addQuestionToSurvey(questionsToAdd: QuestionToAddDTO[]): Promise<boolean> {
    const questionsToAddField: any[][] = questionsToAdd.map((question) => [Number(question.surveyId), Number(question.questionId), Number(question.rankOrder)]);
    const bulkCreateQuery: string = constructBulkQuery(this._addQuestionToSurveyQuery, questionsToAddField);

    const addQuestions: Promise<boolean> = query(bulkCreateQuery)
      .then((results: ResultSetHeader[]) => {
        const resultSetHeaders: ResultSetHeader[] = [results[0]];
        if (!Array.isArray(resultSetHeaders[0])) {
          // when adding a single question
          const resultSetHeader: ResultSetHeader = results[0];
          if (resultSetHeader.affectedRows > 0) {
            this._logger.INFO(`Successfully added the question to the survey`);
            return true;
          } 
          this._logger.INFO(`Failed to add the question to the survey`);
          return false;
        }
        const areAllQuestionsAdded: boolean = resultSetHeaders[0]
          .map(resultSetHeaders => resultSetHeaders.affectedRows > 0)
          .every(bool => bool); 
        if (areAllQuestionsAdded) {
          this._logger.INFO(`Successfully added all the questions to the survey`);
        } else {
          this._logger.INFO(`Failed to add all the questions to the survey`);
        }
        return areAllQuestionsAdded;

      }).catch((err) => {
        this._logger.ERROR(`Failed to add questions to the survey.\nError: ${err}`);
        throw err;
      });

    return addQuestions;
  }

  async deleteSurvey(surveyId: number): Promise<boolean> {
    try {
      const [result] = await query(this._deleteSurveyQuery, [surveyId.toString()]);
      return result.affectedRows > 0;
    } catch (error) {
      this._logger.ERROR(String(error));
      return Promise.reject(error);
    }
  }

  async getAllResponses(surveyId: number): Promise<SurveyResponse[]> {
    try {
      const result: [SurveyResponse[]] = await query(this._getAllSurveyResponse, [surveyId.toString()]);
      return result[0];
    } catch (error) {
      this._logger.ERROR(String(error));
      return Promise.reject(error);
    }
  }
}
