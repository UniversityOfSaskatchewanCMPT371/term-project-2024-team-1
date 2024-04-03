/* eslint-disable @typescript-eslint/naming-convention */
import { SurveyService } from "@app/application/SurveyService";
import { SurveyStatusEnum } from "@app/domain/SurveyStatusEnum";
import { nullOrUndefined } from "@app/application/util";
import { LoggerFactory } from "@app/domain/factory/LoggerFactory";
import { ILogger } from "@app/domain/interfaces/ILogger";
import { IRouteHandler } from "@app/domain/interfaces/IRouteHandler";
import assert from "assert";
import { Request, Response } from "express";
import { injectable } from "tsyringe";



@injectable()
export class SurveyGetUsersSubmittedHandler implements IRouteHandler<string[] | null> {
  private readonly _logger: ILogger = LoggerFactory.getLogger(SurveyGetUsersSubmittedHandler.name);
  constructor(private readonly _surveyService: SurveyService) {
  }

  public handle(req: Request, res: Response): void {
    if (!this.validation(req)) {
      this._logger.INFO("Failed to get users, surveyId wasn't provided");
      res.status(400).send("SurveyId is required");
      return;   
    }
    this._logger.INFO("validation of the req is successful");
    if (req.query.type === SurveyStatusEnum.COMPLETED) {
      this.handleGetUsersCompleted(req, res);
      return;
    }
    this.handleGetUsersNotCompleted(req, res); 
  }

  public handleGetUsersCompleted(req: Request, res: Response): void {
    this._logger.INFO(`Getting users who have completed survey ${req.params.surveyId}`);
    this.execute(req).then((userIds) => {
      this._logger.INFO("Execution of getting users who completed the survey is successful");
      assert(!nullOrUndefined(userIds), "array of userIds must not be null");
      if (userIds.length === 0) {
        this._logger.INFO(`Empty array returned! No users have completed survey ${req.params.surveyId}`);
        res.status(200).send("No users have completed the survey");
        return;
      }
      this._logger.INFO(`Retrieved all users who have completed survey ${req.params.surveyId}`);
      res.status(200).send(userIds);
    }).catch((error: any) => {
      this._logger.ERROR(`Failed to retrive all users who completed the survey, error occured: ${error}`);
      res.status(500).send("Server failed to retrieve users, please try again.");
    });

  }

  private handleGetUsersNotCompleted(req: Request, res: Response): void {
    this._logger.INFO(`Getting users who have not completed survey ${req.params.surveyId}`);
    this.execute(req).then((userIds) => {
      this._logger.INFO("Execution of getting users who have not completed the survey is successful");
      assert(!nullOrUndefined(userIds), "array of userIds must not be null");
      if (userIds.length === 0) {
        this._logger.INFO(`Empty array returned! All users have completed survey ${req.params.surveyId}`);
        res.status(200).send("All users have completed the survey");
        return;
      }
      this._logger.INFO(`Retrieved all users who have not completed survey ${req.params.surveyId}`);
      res.status(200).send(userIds);
    }).catch((error: any) => {
      this._logger.ERROR(`Failed to retrive all users who have not completed the survey, error occured: ${error}`);
      res.status(500).send("Server failed to retrieve users, please try again.");
    });

  }


  public async execute(req: Request): Promise<string[] | null> {
    const surveyId: number = Number(req.params.surveyId);
    if (req.query.type === SurveyStatusEnum.COMPLETED) {
      const userIds: string[] | null = await this._surveyService.getUsersCompletedSurvey(surveyId);
      return userIds;
    }
    const userIds: string[] | null = await this._surveyService.getUsersNotCompletedSurvey(surveyId);
    return userIds;
    
    
  } 

  public validation(...args: any[]): boolean {
    const request: Request = args[0];
    return (
      !nullOrUndefined(request.params) && 
      !nullOrUndefined(request.query) &&
      !nullOrUndefined(request.query.type) &&
      (request.query.type === SurveyStatusEnum.COMPLETED || request.query.type === SurveyStatusEnum.NOT_COMPLETED) &&
      !nullOrUndefined(request.params.surveyId) && 
      !isNaN(Number(request.params.surveyId))
    ); 
  }


}

