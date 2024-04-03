import { Request, Response } from "express";
import { injectable } from "tsyringe";
import { SurveyService } from "@app/application/SurveyService";
import { LoggerFactory } from "@app/domain/factory/LoggerFactory";
import { ILogger } from "@app/domain/interfaces/ILogger";
import { nullOrUndefined } from "@app/application/util";
import { QuestionToAddDTO } from "@app/adapter/DTOs/QuestionToAddDTO";


@injectable()
export class SurveyQuestionAddHandler {
  private readonly _logger: ILogger = LoggerFactory.getLogger(SurveyQuestionAddHandler.name);

  public constructor(private readonly _surveyService: SurveyService) { }

  public handle(req: Request, res: Response): void {
    if (!this.validation(req, res)) {
      return;
    } 
    this.execute(req).then((success) => {
      if (success) { 
        this._logger.INFO(`Successfully added questions to survey ${req.body.surveyId}`);
        res.status(200).send(`Successfully added questions to the survey`);
      } else {
        this._logger.INFO(`Failed to add questions to survey ${req.body.surveyId}`);
        res.status(400).send(`Failed to add questions to the survey`);
      }
    }).catch((err) => {
      this._logger.ERROR(`Failed to add questions to the ${req.body.surveyId}, error occured: ${err}`);
      res.status(500).send("Server failed to process request, please try again");
    });
  }

  public async execute(req: Request): Promise<boolean> {
    const surveyId: string = req.params.surveyId;
    const questionsToAdd: QuestionToAddDTO[] = req.body.map((question: any) => ({
      ...question,
      surveyId
    }));
    return this._surveyService.addQuestionToSurvey(questionsToAdd);
  }

  public validation(...args: any[]): boolean { 
    const req: Request = args[0];
    const res: Response = args[1];
    const surveyId: string = req.params.surveyId;
    const questionsToAdd: any[] = req.body.map((question: any) => ({
      ...question,
      surveyId
    }));
    if (questionsToAdd.length <= 0) {
      this._logger.ERROR("No questions provided to add to the survey.");
      res.status(422).send("No questions provided to add to the survey.");
      return false;
    }

    const isValid: boolean = questionsToAdd.every((question: any) => {
      if (
        nullOrUndefined(question) ||
        nullOrUndefined(question.surveyId) ||
        nullOrUndefined(question.questionId) ||
        nullOrUndefined(question.rankOrder) ||
        isNaN(Number(question.surveyId)) ||
        isNaN(Number(question.questionId)) ||
        isNaN(Number(question.rankOrder))
      ) { return false; }
      return true;
    }); 
    if (isValid) {
      this._logger.INFO("validation of the request is successful");
    } else {
      this._logger.ERROR("Invalid format provided to the API");
      res.status(422).send("Some required fields not provided in the correct format");
    }
    return isValid;

  }
}
