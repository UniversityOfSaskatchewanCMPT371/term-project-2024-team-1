import { surveyAnswerRepoToken, surveyQuestionRepoToken, surveyRepoToken } from "@app/adapter/DependencyInjections";
import { Survey } from "@app/domain/Survey";
import { SurveyAnswer } from "@app/domain/SurveyAnswer";
import { SurveyQuestion } from "@app/domain/SurveyQuestion";
import { LoggerFactory } from "@app/domain/factory/LoggerFactory";
import { ILogger } from "@app/domain/interfaces/ILogger";
import { ISurveyAnswerRepository } from "@app/domain/interfaces/repositories/ISurveyAnswerRepository";
import { ISurveyQuestionRepository } from "@app/domain/interfaces/repositories/ISurveyQuestionRepository";
import { ISurveyRepository } from "@app/domain/interfaces/repositories/ISurveyRepository";
import { delay, inject, injectable } from "tsyringe";

@injectable()
export class SurveyService {
  private readonly _logger: ILogger = LoggerFactory.getLogger(SurveyService.name);

  constructor(@inject(delay(() => surveyRepoToken)) private readonly _surveyRepository: ISurveyRepository,
    @inject(delay(() => surveyQuestionRepoToken)) private readonly _surveyQuestionRepo: ISurveyQuestionRepository,
    @inject(delay(() => surveyAnswerRepoToken)) private readonly _surveyAnswerRepo: ISurveyAnswerRepository) {
  }

  public async getAll(): Promise<Survey[]> {
    return this._surveyRepository.getAll();
  };

  public async getSurvey(surveyId: number): Promise<Survey | null> {
    try {
      return this._surveyRepository.getSurvey(surveyId);
    } catch (error) {
      this._logger.ERROR(`Failed to get survey. \nError: ${error as string}`);
      throw error;
    }
  };

  public async getSurveyContent(userId: string, surveyId: number): Promise<SurveyQuestion[]> {
    const surveyQuestions: SurveyQuestion[] = await this._surveyQuestionRepo.getBySurvey(surveyId);
    if (surveyQuestions.length === 0) {
      return surveyQuestions;
    }
    console.log("survey questions", surveyQuestions);

    const surveyAnswers: SurveyAnswer[] = await this._surveyAnswerRepo.getSurveyAnswers(userId, surveyId);
    console.log("survey answers", surveyAnswers);
    throw Error();
  }

  public async createSurvey(survey: Survey): Promise<boolean> {
    return this._surveyRepository.createSurvey(survey);
  };

  public async getSurveySubmittedUsers(surveyId: number): Promise<string[] | null> {
    try {
      return this._surveyRepository.getSurveySubmittedUsers(surveyId);
    } catch (error) {
      this._logger.ERROR(`Failed to create survey. \nError: ${error as string}`);
      throw error;
    };
  }

  public async deleteSurvey(surveyId: number): Promise<boolean> {
    return this._surveyRepository.deleteSurvey(surveyId);
  };

}

