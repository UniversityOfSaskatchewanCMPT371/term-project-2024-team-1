/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { SurveyService } from "@app/application/SurveyService";
import { LoggerFactory } from "@app/domain/factory/LoggerFactory";
import { ILogger } from "@app/domain/interfaces/ILogger";
import { Request, Response } from "express";
import { Survey } from "@app/domain/Survey";
import { nullOrUndefined } from "@app/application/util";
import { injectable } from "tsyringe";

@injectable()
export class SurveyAddHandler {
  private readonly _logger: ILogger = LoggerFactory.getLogger(SurveyAddHandler.name);

  public constructor(private readonly _surveyService: SurveyService) { }
  
  public handle(req: Request, res: Response): void {
    if (!this.validation(req, res)) {
      return;
    }
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

  public async execute(req: Request): Promise<boolean> {
    const surveyName: string = req.body.surveyName;
    const dueDate: Date = req.body.dueDate; 
    const surveyId: number = -1;
    const newSurvey: Survey = new Survey(surveyId, surveyName, dueDate);
    return this._surveyService.createSurvey(newSurvey);
  }

  public validation(...args: any[]): boolean {
    const request: Request = args[0];
    const response: Response = args[1];
    if (
      !nullOrUndefined(request.body) && 
      !nullOrUndefined(request.body.surveyName) && 
      !nullOrUndefined(request.body.dueDate)) {
      
      const dateObject: Date = new Date(request.body.dueDate);
      if (!isNaN(dateObject.getTime())) {
        this._logger.INFO("Successfully validated survey request");
        return true;
      } else {
        this._logger.INFO(`Due date not formatted properly, ${request.body.dueDate}`);
        response.status(422).send("Incorrect survey format, please try again!");
        return false;
      }
    } else {
      response.status(422).send("Incorrect survey format, please try again!");
      return false;
    }
  };
  
}
