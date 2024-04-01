import { surveyAnswerRepoToken } from "@app/adapter/DependencyInjections";
import { LoggerFactory } from "@app/domain/factory/LoggerFactory";
import { ILogger } from "@app/domain/interfaces/ILogger";
import { ISurveyAnswerRepository } from "@app/domain/interfaces/repositories/ISurveyAnswerRepository";
import { SurveyAnswer } from "@app/domain/SurveyAnswer";
import { delay, inject, injectable } from "tsyringe";

@injectable()
export class SurveyAnswerService {
  private readonly _logger: ILogger = LoggerFactory.getLogger(SurveyAnswerService.name);

  public constructor(@inject(delay(() => surveyAnswerRepoToken)) private readonly _surveyAnswerRepository: ISurveyAnswerRepository) { }

  public async create(userId: string, answer: SurveyAnswer): Promise<number> {
    return this._surveyAnswerRepository.create(userId, answer);
  };
  
  public async update(answers: SurveyAnswer[]): Promise<boolean> {
    return this._surveyAnswerRepository.update(answers);
  }

}
