import { Request, Response } from "express";
import { delay, inject, injectable } from "tsyringe";
import { SurveyService } from "@app/application/SurveyService";
import { LoggerFactory } from "@app/domain/factory/LoggerFactory";
import { ILogger } from "@app/domain/interfaces/ILogger";
import { nullOrUndefined } from "@app/application/util";


@injectable()
export class SurveyQuestionAddHandler {
  private readonly _logger: ILogger = LoggerFactory.getLogger(SurveyQuestionAddHandler.name);

  constructor(@inject(delay(() => SurveyService)) private readonly _surveyService: SurveyService) {
  }

  public handle(req: Request, res: Response): void {
    if (!this.validation(req, res)) {
      return; 
    }
    this.execute(req).then((success) => {
      if (success) { 
        this._logger.INFO(`Successfully added question ${req.body.questionId} to the survey ${req.body.surveyId}`);
        res.status(200).send(`Successfully added question to the survey`);
      } else {
        this._logger.INFO(`Failed to add question ${req.body.questionId} to the survey ${req.body.surveyId}`);
        res.status(400).send(`Failed to add question to the survey`);
      }
    }).catch((err) => {
      this._logger.ERROR(`Failed to add question ${req.body.questionId} to the survey ${req.body.surveyId}, error occured: ${err}`);
      res.status(500).send("Server failed to process request, please try again");
    });
  }

  public async execute(req: Request): Promise<boolean> {
    const questionId: number = Number(req.params.questionId);
    const surveyId: number = Number(req.params.surveyId);
    const rankOrder: number = Number(req.body.rankOrder);
    return this._surveyService.addQuestionToSurvey(surveyId, questionId, rankOrder);
  }

  public validation(...args: any[]): boolean { 
    const req: Request = args[0];
    const res: Response = args[1];
    const isValid: boolean = 
      !nullOrUndefined(req.params) &&
      !nullOrUndefined(req.body) &&
      !nullOrUndefined(req.params.surveyId) &&
      !nullOrUndefined(req.params.questionId) &&
      !nullOrUndefined(req.body.rankOrder) &&
      !isNaN(Number(req.params.surveyId)) &&
      !isNaN(Number(req.params.questionId)) &&
      !isNaN(Number(req.body.rankOrder));
    if (isValid) {
      this._logger.INFO("validation of the request is successful");
      return isValid;
    }
    this._logger.ERROR("Invalid format provided to the API");
    res.send(422).send("Required fields not provided");
    return isValid; 
  }
}
