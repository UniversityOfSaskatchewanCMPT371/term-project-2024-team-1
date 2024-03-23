import { query } from "@app/adapter/SQLRepositories/SQLConfiguration";
import { Survey } from "@app/domain/Survey";
import "reflect-metadata";
import { getLogger } from "log4js";
import { ISurveyRepository } from "@app/domain/interfaces/repositories/ISurveyRepository";

export class SurveySQLRepository implements ISurveyRepository {

  private readonly _logger = getLogger(SurveySQLRepository.name);

  private readonly _getAllQuery: string = "SELECT * FROM Survey";
  private readonly _getSurveyQuery: string = "SELECT * FROM Survey WHERE surveyName = ?";
  private readonly _createSurveyQuery: string = "INSERT INTO Survey (surveyName, dateCreated) VALUES (?, NOW())";
  private readonly _addQuestionToSurveyQuery: string = "INSERT INTO SurveyQuestionMap (surveyId, questionId, rankOrder) VALUES (?, ?, ?)";
  private readonly _deleteSurveyQuery: string = "DELETE FROM Survey WHERE surveyName = ?";
  
  async getAll(): Promise<Survey[]> {
    try {
      const [data] = await query(this._getAllQuery);
      return data;
    } catch (error) {
      this._logger.error(error);
      return Promise.reject(error);
    }
  }

  async getSurvey(surveyName: string): Promise<Survey | null> {
    try {
      const [data] = await query(this._getSurveyQuery, [surveyName]);
      if (data.length === 0) {
        return null;
      }
      return data[0];
    } catch (error) {
      this._logger.error(error);
      throw error;
    }
  }

  async createSurvey(survey: Survey): Promise<boolean> {
    try {
      const [result] = await query(this._createSurveyQuery, [survey.surveyName]);
      return result.affectedRows > 0;
    } catch (error) {
      this._logger.error(error);
      return Promise.reject(error);
    }
  }

  async addQuestionToSurvey(surveyId: number, questionId: number, rankOrder: number): Promise<boolean> {
    try {
      const [result] = await query(this._addQuestionToSurveyQuery, [surveyId.toString(), questionId.toString(), rankOrder.toString()]);
      return result.affectedRows > 0;
    } catch (error) {
      this._logger.error(`Failed to add question ${questionId} to survey ${surveyId}:`, error);
      return Promise.reject(error);
    }
  }


  async deleteSurvey(surveyName: string): Promise<boolean> {
    try {
      const [result] = await query(this._deleteSurveyQuery, [surveyName]);
      return result.affectedRows > 0;
    } catch (error) {
      this._logger.error(error);
      return Promise.reject(error);
    }
  }  
}
