import { SurveyService } from "@app/application/SurveyService";
import { Survey } from "@app/domain/Survey";
import { Request, Response } from "express";
import { getLogger } from "log4js";
import { injectable } from "tsyringe";

@injectable()
export class SurveyAddHandler {
  private readonly _logger = getLogger(SurveyAddHandler.name);

  constructor(private readonly _surveyService: SurveyService) {
  }
  
  public async handle(req: Request, res: Response): Promise<void> {
    try {
      if (await this.execute(req)) {
        this._logger.info(`Successfully created new survey ${req.body.surveyName}`);
        res.status(200).send("Survey added successfully.");
      } else {
        this._logger.info("Failed to create new survey");
        res.status(400).send("Failed to create survey.");
      }
    } catch (error) {
      this._logger.error("Error creating survey:", error);
      res.status(500).send("Error occurred while creating survey.");
    }
  }

  private async execute(req: Request): Promise<boolean> {
    try {
      const surveyName: string = req.body.surveyName;
      const dateCreated: Date = new Date();
      const newSurvey: Survey = new Survey(1, surveyName, dateCreated);
      return await this._surveyService.createSurvey(newSurvey);
    } catch (error) {
      this._logger.error("Error creating survey:", error);
      throw error;
    }
  }
}
