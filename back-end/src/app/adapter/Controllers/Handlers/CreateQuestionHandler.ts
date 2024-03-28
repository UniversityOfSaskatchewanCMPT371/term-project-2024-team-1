/* eslint-disable @typescript-eslint/naming-convention */
import { IRouteHandler } from "@app/domain/interfaces/IRouteHandler";
import { SurveyQuestion } from "@app/domain/SurveyQuestion";
import { Request, Response } from "express";
import { delay, inject, injectable } from "tsyringe";
import { LoggerFactory } from "@app/domain/factory/LoggerFactory";
import { ILogger } from "@app/domain/interfaces/ILogger";
import { SurveyQuestionService } from "@app/application/SurveyQuestionService";
import { nullOrUndefined } from "@app/application/util";

@injectable()
export class QuestionCreateHandler implements IRouteHandler<boolean> {
    
  private readonly _logger: ILogger = LoggerFactory.getLogger(QuestionCreateHandler.name);

  constructor(@inject(delay(() => SurveyQuestionService)) private readonly _surveyQuestionService: SurveyQuestionService) {
  }

  public handle(req: Request, res: Response): void {
    if (!this.validation(req, res)) {
      return; 
    }
    this.execute(req).then((success) => {
      if (success) {
        this._logger.INFO("Successfully created survey question");
        res.status(201).send("Successfully created survey question");
      } else {
        this._logger.INFO("Failed to create survey question");
        res.status(400).send("Failed to create survey question");
      }
    }).catch(err => {
      this._logger.ERROR(`Failed to create survey question, error occured: ${err}`);
      res.status(500).send("Server failed to process request, please try again");
    });
  }

  public async execute(req: Request): Promise<boolean> {
    const questions: SurveyQuestion[] = req.body;
    questions.forEach((question) => { question.parentId = question.parentId ?? null; });
    return this._surveyQuestionService.create(questions);
  }

  public validation(...args: any[]): boolean {
    const request: Request = args[0];
    const res: Response = args[1];
    const questions: SurveyQuestion[] = request.body;
    if (questions.length <= 0) {
      this._logger.ERROR("No questions were provided to the API");
      res.status(422).send("You must provide questions to create");
      return false;
    };
    const isValid: boolean = questions.every((question: SurveyQuestion) => {
      if (
        nullOrUndefined(question) ||
        nullOrUndefined(question.question) ||
        nullOrUndefined(question.standard) ||
        nullOrUndefined(question.type) ||
        (typeof question.standard !== "boolean" && question.standard !== "true" && question.standard !== "false") ||
        (question.parentId !== null && question.parentId !== undefined && isNaN(Number(question.parentId)))
      ) { return false; } 
      return true;
    });
    if (isValid) {
      this._logger.INFO("Successfully validated all the survey questions");
    } else {
      this._logger.ERROR("Invalid question provided to the API");
      res.status(422).send("Invalid question provided to the API");
    }
    return isValid;

  };
}
