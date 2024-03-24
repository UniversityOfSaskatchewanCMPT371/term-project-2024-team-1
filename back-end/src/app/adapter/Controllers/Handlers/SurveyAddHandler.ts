import { Request, Response } from "express";
import { delay, inject, injectable } from "tsyringe";
import { SurveyService } from "@app/application/SurveyService";
import { getLogger } from "log4js";
import { Survey } from "@app/domain/Survey";

@injectable()
export class SurveyAddHandler {
  private readonly _logger = getLogger(SurveyAddHandler.name);

  constructor(@inject(delay(() => SurveyService)) private readonly _surveyService: SurveyService) {
    // this._surveyService = container.resolve(SurveyService);
  }
  
  public async handle(req: Request, res: Response): Promise<void> {
    try {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      if (await this.execute(req)) {
        res.status(200).send("Sample survey added successfully.");
      } else {
        res.status(400).send("Failed to add sample survey.");
      }
    } catch (error) {
      res.status(500).send("Error occurred while adding sample survey.");
    }
  }

  private async execute(req: Request): Promise<boolean> {
    try {
      const surveyName: string = req.body.surveyName;
      const dateCreated: Date = new Date();
      const dueDate: Date = new Date(); // fake due date 
      const newSurvey: Survey = new Survey(1, surveyName, dateCreated, dueDate);
      return await this._surveyService.createSurvey(newSurvey);
    } catch (error) {
      this._logger.error("Error adding sample survey:", error);
      throw error;
    }
  }
}
