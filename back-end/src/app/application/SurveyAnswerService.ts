import { surveyAnswerRepoToken } from "@app/adapter/DependencyInjections";
import { SurveyAnswer } from "@app/domain/SurveyAnswer";
import { ISurveyAnswerRepository } from "@app/domain/interfaces/repositories/ISurveyAnswerRepository";
import { inject, injectable } from "tsyringe";

@injectable()
export class SurveyAnswerService {
  constructor(@inject(surveyAnswerRepoToken) private readonly _surveyAnswerRepository: ISurveyAnswerRepository) {
  }
 
  public async create(userId: string, answer: string, questionId: number): Promise<boolean> {
    return this._surveyAnswerRepository.create(userId, answer, questionId);
  };

  public async update(answer: SurveyAnswer): Promise<boolean> {
    return this._surveyAnswerRepository.update(answer);
  };

}

