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
  
  public async update(answers: SurveyAnswer[]): Promise<boolean> {
    const dirtyAnswers: SurveyAnswer[] = answers.filter(answer => answer.isDirty);

    if(dirtyAnswers.length === 0) {
      this._logger.INFO("No answers to update");
      return true;
    }
    try {
      const updatedAnswer = await this._surveyAnswerRepository.update(dirtyAnswers);
      if (updatedAnswer){
        this._logger.INFO("Successfully updated answers");
      }
      else{
        this._logger.ERROR("Failed to update answers");
      }
      return updatedAnswer;
    }
    catch(error) {
      this._logger.ERROR(`Failed to update answers: ${error as string}`);
      throw Error(`Failed to update answers: ${error as string}`);
    }
  }

}
