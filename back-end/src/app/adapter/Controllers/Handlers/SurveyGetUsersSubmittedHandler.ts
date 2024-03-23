/* eslint-disable @typescript-eslint/naming-convention */
import { SurveyService } from "@app/application/SurveyService";
import { nullOrUndefined } from "@app/application/util";
import { IRouteHandler } from "@app/domain/interfaces/IRouteHandler";
import { Request, Response } from "express";
import { container, injectable } from "tsyringe";
import assert from "assert";
import { LoggerFactory } from "@app/domain/factory/LoggerFactory";
import { ILogger } from "@app/domain/interfaces/ILogger";



@injectable()
export class SurveyGetUsersSubmittedHandler implements IRouteHandler<string[] | null> {
  private readonly _logger: ILogger = LoggerFactory.getLogger(SurveyGetUsersSubmittedHandler.name);
  constructor(private readonly _surveyService: SurveyService) {
    this._surveyService = container.resolve(SurveyService);
  }

  public handle(req: Request, res: Response): void {
    if (!this.validation(req)) {
      this._logger.INFO("Failed to get users, surveyId wasn't provided");
      res.status(400).send("SurveyId is required");
      return;   
    } 
    this._logger.INFO("validation of the req is successful");
    this.execute(req).then((userIds) => {
      this._logger.INFO("Execution of getting users is successful");
      assert(!nullOrUndefined(userIds), "array of userIds is null");
      if (userIds.length === 0) {
        this._logger.INFO(`Empty array returned. No users have completed the survey ${req.params.surveyId}`);
        res.status(200).send("No users have completed the survey");
      }
      this._logger.INFO("Retrieved all users");
      res.status(200).send(userIds);
    }).catch((error: any) => {
      this._logger.ERROR(`Failed to retrive all users, error occured: ${error}`);
      res.status(500).send("Server failed to retrieve users, please try again.");
    });
  }

  public async execute(req: Request): Promise<string[] | null> {
    const surveyId: number = Number(req.params.surveyId);
    const userIds: string[] | null = await this._surveyService.getSurveySubmittedUsers(surveyId);
    return userIds;
  } 

  public validation(...args: any[]): boolean {
    const request: Request = args[0];
    return (
      !nullOrUndefined(request.params) && 
      !nullOrUndefined(request.params.surveyId) && 
      !isNaN(Number(request.params.surveyId))
    ); 
  }


}

