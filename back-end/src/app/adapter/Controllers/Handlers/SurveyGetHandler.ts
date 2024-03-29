import { SurveyService } from "@app/application/SurveyService";
import { AuthenticatedRequest, nullOrUndefined } from "@app/application/util";
import { SurveyQuestion } from "@app/domain/SurveyQuestion";
import { LoggerFactory } from "@app/domain/factory/LoggerFactory";
import { ILogger } from "@app/domain/interfaces/ILogger";
import { IRouteHandler } from "@app/domain/interfaces/IRouteHandler";
import { injectable } from "tsyringe";
import { Request, Response } from "express";

@injectable()
export class SurveyGetHandler implements IRouteHandler<SurveyQuestion[]> {
  private readonly _logger: ILogger = LoggerFactory.getLogger(SurveyGetHandler.name);
  
  private _surveyId: number;
  private _userId: string;

  public constructor(private readonly _surveyService: SurveyService) { }

  public async handle(req: Request, res: Response): Promise<void> {
    if (!this.validation(req, res)) {
      return;
    }

    this._surveyId = parseInt(req.params.surveyId);
    this._userId = (req as AuthenticatedRequest).auth.userId;

    try {
      const surveyQuestions: SurveyQuestion[] = await this.execute();
      if (surveyQuestions.length === 0) {
        this._logger.INFO(`Attempted to get empty/non-existent survey ${this._surveyId}`);
        res.status(404).send(`Survey ${this._surveyId} doesn't exist or does not have any questions added to it!`);
        return;
      }
      this._logger.INFO(`Successfully retrieved survey questions and content for survey ${this._surveyId}`);
      res.status(200).send(surveyQuestions);
    } catch (error) {
      this._logger.ERROR(`Server failed to fetch survey. \n ${error as string}`);
      res.status(500).send(`Server failed to fetch survey ${this._surveyId}`);
    }
  }

  public async execute(): Promise<SurveyQuestion[]> {
    return this._surveyService.getSurveyContent(this._userId, this._surveyId)
      .catch(error => {
        this._logger.ERROR(`Failed to load survey content for ${this._surveyId}.\n Error: ${error as string}`);
        throw Error(`Failed to load survey content for ${this._surveyId}.\n Error: ${error as string}`);
      });
  };

  public validation(...args: any[]): boolean {
    const req: AuthenticatedRequest = args[0];
    const res: Response = args[1];

    if (nullOrUndefined(req.auth) || nullOrUndefined(req.auth.userId)) {
      res.status(401).send("User id not found, please try re-logging back in");
      return false;
    }


    if (nullOrUndefined(req.params) || nullOrUndefined(req.params.surveyId) || isNaN(parseInt(req.params.surveyId))) {
      res.status(400).send("You must provide an integer survey id");
      return false;
    }

    return true;
  }
}
