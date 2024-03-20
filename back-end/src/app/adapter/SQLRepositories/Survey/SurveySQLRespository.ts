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
  private readonly _deleteSurveyQuery: string = "DELETE FROM Survey WHERE surveyName = ?";

  async getAll(): Promise<Survey[]> {
    try {
      const [data] = await query(this._getAllQuery);
      return data;
    } catch (error) {
      this._logger.error(error);
      throw error;
    }
  }

  async getSurvey(surveyName: string): Promise<Survey | null> {
    try {
      const [data] = await query(this._getSurveyQuery, [surveyName]);
      if (data.length === 0) {
        return null;
      }
      return data[0]; // Return the first survey if found
    } catch (error) {
      this._logger.error(error);
      throw error; // Rethrow for consistency
    }
  }

  async createSurvey(survey: Survey): Promise<boolean> {
    try {
      const [result] = await query(this._createSurveyQuery, [survey.surveyName]);
      return result.affectedRows > 0;
    } catch (error) {
      this._logger.error(error);
      throw error;
    }
  }


  async deleteSurvey(surveyName: string): Promise<boolean> {
    try {
      const [result] = await query(this._deleteSurveyQuery, [surveyName]);
      return result.affectedRows > 0;
    } catch (error) {
      this._logger.error(error);
      throw error;
    }
  }  
}
