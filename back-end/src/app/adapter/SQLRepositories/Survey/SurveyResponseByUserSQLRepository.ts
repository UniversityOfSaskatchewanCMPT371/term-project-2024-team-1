import { query } from "@app/adapter/SQLRepositories/SQLConfiguration";
import { SurveyAnswer } from "@app/domain/SurveyAnswer";
import { SurveyQuestion } from "@app/domain/SurveyQuestion";
import { SurveyResponse } from "@app/domain/SurveyResponsesByUser";
import "reflect-metadata";
import { getLogger } from "log4js";
import { ISurveyResponseByUserRepository } from "@app/domain/interfaces/repositories/ISurveyResponseByUserRepository";

export class SurveyResponseByUserSQLRepository implements ISurveyResponseByUserRepository {

  private readonly _logger = getLogger(SurveyResponseByUserSQLRepository.name);

  private readonly _getResponsesByUserForSurveyQuery: string = `
    SELECT 
        s.id AS survey_id,
        s.survey_name,
        q.id AS question_id,
        q.question,
        q.type AS question_type, 
        a.id AS answer_id,
        a.answer,
        u.id AS user_id,
        u.username
    FROM 
        survey s
    JOIN 
        survey_question_map sqm ON s.id = sqm.survey_id
    JOIN 
        question q ON sqm.question_id = q.id
    JOIN 
        answer a ON q.id = a.question_id
    JOIN 
        user u ON a.user_id = u.id
    WHERE 
        s.id = ? AND u.id = ? 
    ORDER BY 
        sqm.rank, q.id;
    `;
  private readonly _saveSurveyResponseQuery: string = "INSERT INTO answers (user_id, question_id, answer) VALUES (?, ?, ?)";
    
  async getResponsesByUserForSurvey(surveyId: number, userId: string): Promise<SurveyResponse[] | null> {
    try {
    const [data] = await query(this._getResponsesByUserForSurveyQuery, [surveyId.toString(), userId]);
    if (data.length === 0) {
        return null;
    }
    
    const responses = data.map((row: any) => {
        const question = new SurveyQuestion(row.question_id, row.question, true, row.question_type);
        const answer = new SurveyAnswer(row.answer_id, row.answer, row.question_id);
        return { question, answer };
    });
    const surveyResponse = new SurveyResponse(surveyId, userId, responses);  
    return [surveyResponse]; // or just surveyResponse if it's meant to represent the whole survey
    
    } catch (error) {
      this._logger.error("Failed to retrieve survey responses by user for survey: ", error);
      return Promise.reject(error);
    }
  }
  async saveSurveyResponse(surveyResponse: SurveyResponse): Promise<boolean> {
    try {
      const responses = surveyResponse.responses;
      const promises = responses.map(response => query(this._saveSurveyResponseQuery, [surveyResponse.userId, response.question.id.toString(), response.answer.answer]));
      const results = await Promise.all(promises);
      return results.every(result => result.affectedRows > 0);
    } catch (error) {
      this._logger.error(error);
      return Promise.reject(error);
    }
  }
  //TODO: Clarify whether this method should be implemented
    async updateSurveyResponse(surveyResponse: SurveyResponse): Promise<boolean> {
        // Implement this method
        return Promise.resolve(false);
    }
    async deleteResponsesByUserForSurvey(surveyId: number, userId: string): Promise<boolean> {
        // Implement this method
        return Promise.resolve(false);
    }
    async getResponseByUserForQuestion(surveyId: number, userId: string, questionId: number): Promise<{ question: SurveyQuestion; answer: SurveyAnswer } | null> {
        // Implement this method
        return Promise.resolve(null);
    }
}
