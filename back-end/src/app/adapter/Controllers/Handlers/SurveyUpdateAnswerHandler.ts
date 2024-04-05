import { SurveyAnswerService } from "@app/application/SurveyAnswerService";
import { AuthenticatedRequest, nullOrUndefined } from "@app/application/util";
import { LoggerFactory } from "@app/domain/factory/LoggerFactory";
import { ILogger } from "@app/domain/interfaces/ILogger";
import { IRouteHandler } from "@app/domain/interfaces/IRouteHandler";
import { injectable } from "tsyringe";
import { Request, Response } from "express";
import { SurveyAnswer } from "@app/domain/SurveyAnswer";

@injectable()
export class SurveyUpdateAnswerHandler implements IRouteHandler<SurveyAnswer[]> {
  private readonly _logger: ILogger = LoggerFactory.getLogger(SurveyUpdateAnswerHandler.name);

  public constructor(private readonly _surveyService: SurveyAnswerService) { }

  public async handle(req: Request, res: Response): Promise<void> {
    if (this.validation(req, res)) {
      const dirtyAnswers: SurveyAnswer[] = req.body.dirtyAnswers;
      if (dirtyAnswers.length === 0) {
        this._logger.INFO("No answers to update");
        res.status(200).send("No answers to update");
        return;
      }
      try {
        const updateResult: boolean = await this._surveyService.update(dirtyAnswers);
    
        if (updateResult) {
          this._logger.INFO(`Succeeded to update survey answers ${JSON.stringify(dirtyAnswers)}.`);
          res.status(200).send(`Dirty answers ${JSON.stringify(dirtyAnswers)} updated successfully`);
        } else {
          this._logger.ERROR(`Failed to update survey answers ${JSON.stringify(dirtyAnswers)}.`);
          res.status(500).send(`Dirty answers ${JSON.stringify(dirtyAnswers)} not found, update failed.`);
        }
      } catch (error) {
        this._logger.ERROR(`Failed to update survey answers: ${JSON.stringify(error)}`);
        res.status(500).send("An error occurred while updating answers.");
      }
    } else {
      this._logger.ERROR("Failed to update answers.");
      res.status(400).send("Invalid request");
    }


  }

  public async execute(req: Request): Promise<SurveyAnswer[]> {
    const surveyAnswers: SurveyAnswer[] = req.body.dirtyAnswers;
    return surveyAnswers;
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
