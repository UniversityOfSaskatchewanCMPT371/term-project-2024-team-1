import { Request, Response } from "express";
import { container, injectable } from "tsyringe";
import { SurveyService } from "@app/application/SurveyService";
import { getLogger } from "log4js";

@injectable()
export class SurveyAddHandler {
  private readonly _logger = getLogger(SurveyAddHandler.name);

  constructor(private readonly _surveyService: SurveyService) {
    this._surveyService = container.resolve(SurveyService);
  }
  
  public async handle(req: Request, res: Response): Promise<void> {
    try {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const isSuccess: boolean = await this.execute(req);
      if (isSuccess) {
        res.status(200).send("Sample survey added successfully.");
      } else {
        res.status(400).send("Failed to add sample survey."); // Adjust based on your logic
      }
    } catch (error) {
      // Assuming all error handling is done within execute, this catch may be redundant
      res.status(500).send("Error occurred while adding sample survey.");
    }
  }

  private async execute(req: Request): Promise<boolean> {
    try {
      // Directly return the result of createFakeSurvey, assuming it resolves to a boolean
      return await this._surveyService.createFakeSurvey();
    } catch (error) {
      this._logger.error("Error adding sample survey:", error);
      throw error; // Rethrow the error to be handled in the calling method
    }
  }
}
