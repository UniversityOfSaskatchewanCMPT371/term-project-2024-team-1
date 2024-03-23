import { IRouteHandler } from "@app/domain/interfaces/IRouteHandler";
import { Request, Response } from "express";
import { container, injectable } from "tsyringe";
import log4jsConfig from "@resources/log4js-config.json";
import { SurveyQuestionService } from "@app/application/SurveyQuestionService";
import { SurveyQuestion } from "@app/domain/SurveyQuestion";
import { nullOrUndefined } from "@app/application/util";
import { LoggerFactory } from "@app/domain/factory/LoggerFactory";
import { ILogger } from "@app/domain/interfaces/ILogger";
import { configure } from "log4js";

configure(log4jsConfig);

@injectable()
export class QuestionCreateHandler implements IRouteHandler<boolean> {

  private readonly _logger: ILogger = LoggerFactory.getLogger(QuestionCreateHandler.name);
  constructor(private readonly _surveyService: SurveyQuestionService) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    this._surveyService = container.resolve(SurveyQuestionService);
  }

  public handle(req: Request, res: Response): void {
    const question: SurveyQuestion = req.body;
    if (this.validation(question)) {
      this.execute(req)
        .then(success => {
          if (success) {
            this._logger.INFO(`Successfully created survey question`);
            res.status(201).send("Successfully created survey question");
          } else {
            this._logger.ERROR(`Failed to create survey question`);
            res.status(400).send("Failed to create survey question");
          }
        }).catch(err => {
          this._logger.ERROR(`Failed to create survey question: ${err}`);
          res.status(500).send("Server failed to process request, please try again");
        });
    } else {
      this._logger.INFO("Validation failed for creating survey question");
      res.status(422).send("Invalid survey question data provided");
    }
  }

  public async execute(req: Request): Promise<boolean> {
    this._logger.INFO("user request status updated to approved");
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const question: SurveyQuestion = new SurveyQuestion(req.body.question, req.body.standard, req.body.type, req.body.parentId ?? null);
    return this._surveyService.create(question);
  }

  public validation(question: any): boolean {
    return question && !nullOrUndefined(question.question) && !nullOrUndefined(question.standard) && !nullOrUndefined(question.type);
  };
}
