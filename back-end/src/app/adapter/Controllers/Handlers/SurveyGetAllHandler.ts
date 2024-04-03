import { SurveyService } from "@app/application/SurveyService";
import { LoggerFactory } from "@app/domain/factory/LoggerFactory";
import { ILogger } from "@app/domain/interfaces/ILogger";
import { IRouteHandler } from "@app/domain/interfaces/IRouteHandler";
import { Survey } from "@app/domain/Survey";
import { Request, Response } from "express";
import { injectable, inject, delay } from "tsyringe";

@injectable()
export class SurveyGetAllHandler implements IRouteHandler<Survey[]> {
  private readonly _logger: ILogger = LoggerFactory.getLogger(SurveyGetAllHandler.name);
  public constructor(private readonly _surveyService: SurveyService) { }

  public handle(req: Request, res: Response): void {
    this.execute(req)
      .then((surveys: Survey[]) => {
        this._logger.INFO("Successfully retrieved all surveys");
        res.status(200).send(surveys);
      })
      .catch(err => {
        this._logger.ERROR(`Server failed to fetch all surveys. Error: ${err}`);
        res.status(500).send(`Server failed to fetch all surveys`);
      });
  }

  public async execute(req: Request): Promise<Survey[]> {
    return this._surveyService.getAll();
  }

  public validation(...args: any[]): boolean {
    return true;
  }
}
