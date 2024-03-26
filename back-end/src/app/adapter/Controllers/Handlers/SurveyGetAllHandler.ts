import { SurveyDTO } from "@app/adapter/DTOs/SurveyDTO";
import { SurveyService } from "@app/application/SurveyService";
// import { nullOrUndefined } from "@app/application/util";
import { Survey } from "@app/domain/Survey";
import { IRouteHandler } from "@app/domain/interfaces/IRouteHandler";
import log4jsConfig from "@resources/log4js-config.json";
import { Request, Response } from "express";
import { configure, getLogger } from "log4js";
import { delay, inject, injectable } from "tsyringe";
// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
configure(log4jsConfig);

@injectable()
export class SurveyGetAllHandler implements IRouteHandler<SurveyDTO[]> {
  
  private readonly _logger = getLogger(SurveyGetAllHandler.name);
  
  constructor(@inject(delay(() => SurveyService)) private readonly _surveyService: SurveyService) {
  }

  public handle(req: Request, res: Response): void {
    if (this.validation(req)) {
      this.execute(req)
        .then(surveyDTOs => {
          this._logger.info("Retrieved all surveys");
          res.status(200).send(surveyDTOs);
        })
        .catch(error => {
          this._logger.error(error);
          res.status(500).send("Server failed to retrieve surveys, please try again.");
        });
    } else {
      this._logger.info("Failed to retrieve surveys, unknown params were provided");
      res.status(400).send("No parameters required");
    }
  }

  public async execute(req: Request): Promise<SurveyDTO[]> {
    const surveys: Survey[] = await this._surveyService.getAll();
    const surveyDTOs: SurveyDTO[] = surveys.map(survey => new SurveyDTO(survey.surveyName, survey.dateCreated, survey.id, survey.dueDate));
    return surveyDTOs;
  }

  public validation(...args: any[]): boolean {
    return true;
  };

}
