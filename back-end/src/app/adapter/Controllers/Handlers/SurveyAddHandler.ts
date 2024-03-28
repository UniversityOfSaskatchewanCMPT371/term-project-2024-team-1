import { SurveyService } from "@app/application/SurveyService";
import { LoggerFactory } from "@app/domain/factory/LoggerFactory";
import { ILogger } from "@app/domain/interfaces/ILogger";
import { Request, Response } from "express";
import { Survey } from "@app/domain/Survey";
import { nullOrUndefined } from "@app/application/util";
import { isDate } from "util/types";
import { delay, inject, injectable } from "tsyringe";

@injectable()
export class SurveyAddHandler {
  private readonly _logger: ILogger = LoggerFactory.getLogger(SurveyAddHandler.name);

  constructor(@inject(delay(() => SurveyService)) private readonly _surveyService: SurveyService) {
  }
  
  public async handle(req: Request, res: Response): Promise<void> {
    if (!this.validation(req)) {
      this._logger.INFO("Failed to validate survey request");
      res.send(422).status(422).send("Survey is required");
      return;
    }
    this._logger.INFO("Successfully validated survey request");
    this.execute(req).then((success) => {
      if (success) {
        this._logger.INFO("Successfully created survey");
        res.status(201).send("Successfully created survey");
      } else {
        this._logger.INFO("Failed to create survey");
        res.status(400).send("Failed to create survey");
      }
    }).catch((error: any) => {
      this._logger.ERROR(`Failed to create survey, error occured: ${error}`);
      res.status(500).send("Server failed to process request, please try again");
    });

  }

  private async execute(req: Request): Promise<boolean> {
    const surveyName: string = req.body.surveyName;
    const dateCreated: Date = req.body.dateCreated;
    const dueDate: Date = req.body.dueDate; 
    const surveyId: number = -1;
    const newSurvey: Survey = new Survey(surveyId, surveyName, dateCreated, dueDate);
    return this._surveyService.createSurvey(newSurvey);
  }

  public validation(...args: any[]): boolean {
    const request: Request = args[0];
    return (
      !nullOrUndefined(request.body) && 
      !nullOrUndefined(request.body.surveyName) && 
      !nullOrUndefined(request.body.dateCreated) && 
      !nullOrUndefined(request.body.dueDate) &&
      isDate(request.body.dateCreated) &&
      isDate(request.body.dueDate));
  };
  
}
