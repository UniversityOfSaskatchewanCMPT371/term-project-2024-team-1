import { Request, Response } from "express";
import { container, injectable } from "tsyringe";
import { SurveyQuestionService } from "@app/application/SurveyQuestionService";
import { getLogger } from "log4js";
import { SurveyQuestion } from "@app/domain/SurveyQuestion";

@injectable()
export class SurveyQuestionGetHandler {
  private readonly _logger = getLogger(SurveyQuestionGetHandler.name);
  private readonly _surveyQuestionService: SurveyQuestionService;

  constructor() {
    this._surveyQuestionService = container.resolve(SurveyQuestionService);
  }

  public async handle(req: Request, res: Response): Promise<void> {
    try {
      const surveyId: number = parseInt(req.params.surveyId, 10);
      const questions: SurveyQuestion[] | null = await this._surveyQuestionService.getBySurvey(surveyId);

      if (questions) {
        res.status(200).json(questions);
      } else {
        this._logger.info(`No questions found for survey: ${surveyId}`);
        res.status(404).send("No questions found for the specified survey.");
      }
    } catch (error) {
      this._logger.error(`Error occurred while retrieving questions for survey: ${req.params.surveyName}`, error);
      res.status(500).send("Internal server error occurred while retrieving questions.");
    }
  }
}
