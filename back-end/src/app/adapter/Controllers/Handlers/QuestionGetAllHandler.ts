import { IRouteHandler } from "@app/domain/interfaces/IRouteHandler";
import { Request, Response } from "express";
import { configure, getLogger } from "log4js";
import { container, injectable } from "tsyringe";
import log4jsConfig from "@resources/log4js-config.json";
import { SurveyQuestionService } from "@app/application/SurveyQuestionService";
import { SurveyQuestion } from "@app/domain/SurveyQuestion";
configure(log4jsConfig);

@injectable()
export class QuestionGetAllHandler implements IRouteHandler<SurveyQuestion[]> {

  private readonly _logger = getLogger(QuestionGetAllHandler.name);

  constructor(private readonly _surveyService: SurveyQuestionService) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    this._surveyService = container.resolve(SurveyQuestionService);
  }

  public handle(req: Request, res: Response): void {
    this.execute()
      .then(questions => {
        res.json(questions);
      })
      .catch(err => {
        this._logger.error(`Failed to retrieve all survey questions: ${err}`);
        res.status(500).send("Server failed to retrieve survey questions, please try again");
      });
  }

  public async execute(): Promise<SurveyQuestion[]> {
    return this._surveyService.getAll();
  }

  public validation(...args: any[]): boolean {
    return true;
  };

}
