/* eslint-disable @typescript-eslint/naming-convention */
import { SurveyResponseByUserService } from "@app/application/SurveyResponseByUserService";
import { SurveyResponse } from "@app/application/SurveyResponseByUserService";
import { nullOrUndefined } from "@app/application/util";
import { LoggerFactory } from "@app/domain/factory/LoggerFactory";
import { ILogger } from "@app/domain/interfaces/ILogger";
import { IRouteHandler } from "@app/domain/interfaces/IRouteHandler";
import assert from "assert";
import { Request, Response } from "express";
import { injectable } from "tsyringe";

@injectable()
export class SurveyGetUserResponseHandler implements IRouteHandler<SurveyResponse[] | null> {
    private readonly _logger: ILogger = LoggerFactory.getLogger(SurveyGetUserResponseHandler.name);
    constructor(private readonly _surveyResponseByUserService: SurveyResponseByUserService) {
    }
    public handle(req: Request, res: Response): void {
        if (!this.validation(req)) {
            this._logger.INFO("Failed to get user responses, surveyId or userId wasn't provided");
            res.status(400).send("SurveyId and UserId are required");
            return;
          } 
          this._logger.INFO("Validation of the request is successful");
          this.execute(req).then((responses) => {
            this._logger.INFO("Execution of getting user responses is successful");
            if (!responses || responses.length === 0) {
              this._logger.INFO(`No responses found for survey ${req.params.surveyId} and user ${req.params.userId}`);
              res.status(200).send("No responses found for this user and survey");
              return;
            }
            this._logger.INFO("Retrieved all responses for the user and survey");
            res.status(200).json(responses);
          }).catch((error: any) => {
            this._logger.ERROR(`Failed to retrieve user responses, error occurred: ${error}`);
            res.status(500).send("Server failed to retrieve responses, please try again.");
          });
    }

    public async execute(req: Request): Promise<SurveyResponse[] | null> {
        const surveyId: number = Number(req.params.surveyId);
        const userId: string = req.params.userId;
        return await this._surveyResponseByUserService.getResponsesByUserForSurvey(surveyId, userId);
    } 

    public validation(req: Request): boolean {
        return (
          !nullOrUndefined(req.params) && 
          !nullOrUndefined(req.params.surveyId) &&
          !nullOrUndefined(req.params.userId) &&
          !isNaN(Number(req.params.surveyId))
        ); 
      }
}