import { SurveyQuestionService } from "@app/application/SurveyQuestionService";
import { IRouteHandler } from "@app/domain/interfaces/IRouteHandler";
import { SurveyQuestion } from "@app/domain/SurveyQuestion";
import { Request, Response } from "express";
import { injectable, delay, inject } from "tsyringe";
import { ILogger } from "@app/domain/interfaces/ILogger";
import { LoggerFactory } from "@app/domain/factory/LoggerFactory";


@injectable()
export class QuestionGetAllHandler implements IRouteHandler<SurveyQuestion[]> {

  private readonly _logger: ILogger = LoggerFactory.getLogger(QuestionGetAllHandler.name);

  constructor(@inject(delay(() => SurveyQuestionService)) private readonly _surveyQuestionService: SurveyQuestionService) {
  }

  public handle(req: Request, res: Response): void {
    this.execute(req).then((questions: SurveyQuestion[]) => {
      this._logger.INFO("Successfully retrieved all questions");
      res.status(200).send(questions); 
    })
      .catch(err => {
        this._logger.ERROR(`Failed to retrieve all survey questions: ${err}`);
        res.status(500).send("Server failed process request, please try again");
      });
  }

  public async execute(req: Request): Promise<SurveyQuestion[]> {
    return this._surveyQuestionService.getAll();
  }

  public validation(...args: any[]): boolean {
    return true;
  };

}
