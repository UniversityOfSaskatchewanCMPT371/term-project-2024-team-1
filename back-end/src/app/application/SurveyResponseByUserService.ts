import { SurveyResponseByUserRepoToken } from "@app/adapter/DependencyInjections";
import { SurveyResponse } from "@app/domain/SurveyResponsesByUser";
import { ISurveyResponseByUserRepository } from "@app/domain/interfaces/repositories/ISurveyResponseByUserRepository";
import { delay, inject, injectable } from "tsyringe";
import { SurveyQuestion } from "@app/domain/SurveyQuestion";
import { SurveyAnswer } from "@app/domain/SurveyAnswer";

@injectable()
export class SurveyResponseByUserService {
  constructor(@inject(delay(() => SurveyResponseByUserRepoToken)) private readonly _surveyResponseByUserRepository: ISurveyResponseByUserRepository) {
  }

  public async getResponsesByUserForSurvey(surveyId: number, userId: string): Promise<SurveyResponse[] | null> {
    try {
      return this._surveyResponseByUserRepository.getResponsesByUserForSurvey(surveyId, userId);
    } catch (error) {
      console.error("Failed to retrieve survey responses by user for survey: ", error);
      throw error;
    }
  };

  public async saveSurveyResponse(surveyResponse: SurveyResponse): Promise<boolean> {
    try {
      return this._surveyResponseByUserRepository.saveSurveyResponse(surveyResponse);
    } catch (error) {
      console.error("Failed to save survey response: ", error);
      throw error;
    }
  };

  public async updateSurveyResponse(surveyResponse: SurveyResponse): Promise<boolean> {
    try {
      return this._surveyResponseByUserRepository.updateSurveyResponse(surveyResponse);
    } catch (error) {
      console.error("Failed to update survey response: ", error);
      throw error;
    }
  };

  public async deleteResponsesByUserForSurvey(surveyId: number, userId: string): Promise<boolean> {
    try {
      return this._surveyResponseByUserRepository.deleteResponsesByUserForSurvey(surveyId, userId);
    } catch (error) {
      console.error("Failed to delete survey responses by user for survey: ", error);
      throw error;
    }
  };

  public async getResponseByUserForQuestion(surveyId: number, userId: string, questionId: number): Promise<{ question: SurveyQuestion, answer: SurveyAnswer } | null> {
    try {
      return this._surveyResponseByUserRepository.getResponseByUserForQuestion(surveyId, userId, questionId);
    } catch (error) {
      console.error("Failed to retrieve survey response by user for question: ", error);
      throw error;
    }
  };
}
