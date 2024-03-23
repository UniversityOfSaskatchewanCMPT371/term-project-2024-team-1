import { surveyRepoToken } from "@app/adapter/DependencyInjections"; // Ensure you define this token
import { Survey } from "@app/domain/Survey";
import { ISurveyRepository } from "@app/domain/interfaces/repositories/ISurveyRepository";
import { inject, injectable } from "tsyringe";

@injectable()
export class SurveyService {
  constructor(@inject(surveyRepoToken) private readonly _surveyRepository: ISurveyRepository) {
  }

  public async getAll(): Promise<Survey[]> {
    return this._surveyRepository.getAll();
  };

  public async getSurvey(surveyId: number): Promise<Survey | null> {
    try {
      return this._surveyRepository.getSurvey(surveyId);
    } catch (error) {
      console.error("Failed to retrieve survey by name: ", error);
      throw error;
    }
  };

  public async createSurvey(survey: Survey): Promise<boolean> {
    return this._surveyRepository.createSurvey(survey);
  };

  public async getSurveySubmittedUsers(surveyId: number): Promise<string[] | null> {
    try {
      return this._surveyRepository.getSurveySubmittedUsers(surveyId);
    } catch (error) {
      console.error("Failed to retrieve users who completed the survey by surveyId: ", error);
      throw error;
    };
  }

  public async deleteSurvey(surveyId: number): Promise<boolean> {
    return this._surveyRepository.deleteSurvey(surveyId);
  };

  public async createFakeSurvey(): Promise<boolean> {
    // eslint-disable-next-line @typescript-eslint/typedef
    const fakeSurvey = new Survey(1, "Fake Survey", new Date());
    return this._surveyRepository.createSurvey(fakeSurvey);
  }
}

