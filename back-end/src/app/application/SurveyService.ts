import { QuestionToAddDTO } from "@app/adapter/DTOs/QuestionToAddDTO";
import { surveyRepoToken } from "@app/adapter/DependencyInjections";
import { Survey } from "@app/domain/Survey";
import { LoggerFactory } from "@app/domain/factory/LoggerFactory";
import { ILogger } from "@app/domain/interfaces/ILogger";
import { ISurveyRepository } from "@app/domain/interfaces/repositories/ISurveyRepository";
import { delay, inject, injectable } from "tsyringe";

@injectable()
export class SurveyService {
  private readonly _logger: ILogger = LoggerFactory.getLogger(SurveyService.name);
  constructor(@inject(delay(() => surveyRepoToken)) private readonly _surveyRepository: ISurveyRepository) {
  }

  public async getAll(): Promise<Survey[]> {
    return this._surveyRepository.getAll();
  };

  public async getSurvey(surveyId: number): Promise<Survey | null> {
    try {
      return this._surveyRepository.getSurvey(surveyId);
    } catch (error: any) {
      this._logger.ERROR(`Failed to retrieve survey by surveyId, error occred: ${error}`);
      return null;
    }
  };

  public async createSurvey(survey: Survey): Promise<boolean> {
    return this._surveyRepository.createSurvey(survey);
  };

  public async getUsersCompletedSurvey(surveyId: number): Promise<string[] | null> {
    try {
      return this._surveyRepository.getUsersCompletedSurvey(surveyId);
    } catch (error: any) {
      this._logger.ERROR(`Failed to retrieve users who completed the survey by surveyId, error occred: ${error}`);
      throw error;
    };
  }

  public async getUsersNotCompletedSurvey(surveyId: number): Promise<string[] | null> {
    try {
      return this._surveyRepository.getUsersNotCompletedSurvey(surveyId);
    } catch (error: any) {
      this._logger.ERROR(`Failed to retrieve users who have not completed the survey by surveyId, error occred: ${error}`);
      return null;
    };
  }

  public async addQuestionToSurvey(questionToAdd: QuestionToAddDTO[]): Promise<boolean> {
    return this._surveyRepository.addQuestionToSurvey(questionToAdd);
  }

  public async deleteSurvey(surveyId: number): Promise<boolean> {
    return this._surveyRepository.deleteSurvey(surveyId);
  };


}

