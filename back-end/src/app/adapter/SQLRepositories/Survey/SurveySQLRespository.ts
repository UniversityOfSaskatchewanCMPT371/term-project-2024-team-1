import { query } from "@app/adapter/SQLRepositories/SQLConfiguration";
import { Survey } from "@app/domain/Survey";
import "reflect-metadata";
import { getLogger } from "log4js";
import { ISurveyRepository } from "@app/domain/interfaces/repositories/ISurveyRepository";
import { formatDateForSQL } from "@app/application/util";

export class SurveySQLRepository implements ISurveyRepository {

  private readonly _logger = getLogger(SurveySQLRepository.name);

  private readonly _getAllQuery: string = "SELECT * FROM Survey";
  private readonly _getSurveyQuery: string = "SELECT * FROM Survey WHERE id = ?";
  private readonly _createSurveyQuery: string = "INSERT INTO Survey (surveyName, dateCreated, dueDate) VALUES (?, NOW(), ?)";
  private readonly _deleteSurveyQuery: string = "DELETE FROM Survey WHERE id = ?";
  private readonly _getAllSubmittedUsersQuery: string = "SELECT userId FROM SurveyCompletionMap WHERE surveyId = ?";

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
    } catch (error) {
      this._logger.error(error);
      return Promise.reject(error);
    }
  }

  async getSurveySubmittedUsers(surveyId: number): Promise<string[] | null> {
    try {
      return query(this._getAllSubmittedUsersQuery, [surveyId.toString()]).then((result: [string[]]) => {
        return result[0];
      });
    } catch (error) {
      this._logger.error(error);
      return Promise.reject(error);
    }
  }

  async createSurvey(survey: Survey): Promise<boolean> {
    try {
      const [result] = await query(this._createSurveyQuery, [survey.surveyName, formatDateForSQL(survey.dueDate)]);
      return result.affectedRows > 0;
    } catch (error) {
      this._logger.error(error);
      return Promise.reject(error);
    }
  }


  async deleteSurvey(surveyId: number): Promise<boolean> {
    try {
      const [result] = await query(this._deleteSurveyQuery, [surveyId.toString()]);
      return result.affectedRows > 0;
    } catch (error) {
      this._logger.error(error);
      return Promise.reject(error);
    }
  }  
}
