import { surveyQuestionRepoToken } from "@app/adapter/DependencyInjections";
import { SurveyQuestion } from "@app/domain/SurveyQuestion";
import { ISurveyQuestionRepository } from "@app/domain/interfaces/repositories/ISurveyQuestionRepository";
import { delay, inject, injectable } from "tsyringe";

@injectable()
export class SurveyQuestionService {
  constructor(@inject(delay(() => surveyQuestionRepoToken)) private readonly _surveyQuestionRepository: ISurveyQuestionRepository) {
  }

  public async getAll(): Promise<SurveyQuestion[]> {
    return this._surveyQuestionRepository.getAll();
  };

  public async getBySurvey(surveyName: string): Promise<SurveyQuestion[] | null> {
    try {
      return this._surveyQuestionRepository.getBySurvey(surveyName);
    } catch (error) {
      console.error("Failed to retrieve question by survey: ", error);
      throw error;
    }
  };

  public async create(question: SurveyQuestion[]): Promise<boolean> {
    return this._surveyQuestionRepository.create(question);
  };

}

