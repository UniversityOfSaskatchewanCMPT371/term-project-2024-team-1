import { surveyRepoToken } from "@app/adapter/DependencyInjections";
import { Survey } from "@app/domain/Survey";
import { ISurveyRepository } from "@app/domain/interfaces/repositories/ISurveyRepository";
import { delay, inject, injectable } from "tsyringe";

@injectable()
export class SurveyService {
  constructor(@inject(delay(() => surveyRepoToken)) private readonly _surveyRepository: ISurveyRepository) {
  }

  public async getAll(): Promise<Survey[]> {
    return this._surveyRepository.getAll();
  };

  public async getSurvey(surveyName: string): Promise<Survey | null> {
    try {
      return this._surveyRepository.getSurvey(surveyName);
    } catch (error) {
      console.error("Failed to retrieve survey by name: ", error);
      throw error;
    }
  };

  public async createSurvey(survey: Survey): Promise<boolean> {
    return this._surveyRepository.createSurvey(survey);
  };

  public async deleteSurvey(surveyName: string): Promise<boolean> {
    return this._surveyRepository.deleteSurvey(surveyName);
  };

  public async addQuestionToSurvey(surveyId: number, questionId: number, rankOrder: number): Promise<boolean> {
    return this._surveyRepository.addQuestionToSurvey(surveyId, questionId, rankOrder);
  }
}

