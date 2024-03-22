import { Request, Response } from "express";
import { container, injectable } from "tsyringe";
import { SurveyService } from "@app/application/SurveyService";
import { getLogger } from "log4js";

@injectable()
export class SurveyQuestionAddHandler {
  private readonly _logger = getLogger(SurveyQuestionAddHandler.name);

  constructor(private readonly _surveyService: SurveyService) {
    this._surveyService = container.resolve(SurveyService);
  }

  public async handle(req: Request, res: Response): Promise<void> {
    try {
      if (typeof (req.body.surveyId, req.body.questionId, req.body.rank) === "number") {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        if (await this.execute(req.body.surveyId, req.body.questionId, req.body.rank)) {
          res.status(200).json({ message: "Question added to survey successfully." });
        } else {
          res.status(400).json({ message: "Failed to add question to survey." });
        }
      } 
    } catch (error) {
      this._logger.error("Error occurred while adding question to survey:", error);
      res.status(500).json({ message: "Internal server error", error });
    }
  }

  private async execute(surveyId: number, questionId: number, rank: number): Promise<boolean> {
    try {
      return await this._surveyService.addQuestionToSurvey(surveyId, questionId, rank);
    } catch (error) {
      this._logger.error("Error adding question to survey:", error);
      throw error;
    }
  }
}
