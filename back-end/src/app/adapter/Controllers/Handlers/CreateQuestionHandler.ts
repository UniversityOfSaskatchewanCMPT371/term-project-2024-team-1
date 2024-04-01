import { SurveyQuestionService } from "@app/application/SurveyQuestionService";
import { nullOrUndefined } from "@app/application/util";
import { IRouteHandler } from "@app/domain/interfaces/IRouteHandler";
import { SurveyQuestion } from "@app/domain/SurveyQuestion";
import log4jsConfig from "@resources/log4js-config.json";
import { Request, Response } from "express";
import { configure, getLogger } from "log4js";
import { injectable } from "tsyringe";
configure(log4jsConfig);

@injectable()
export class QuestionCreateHandler implements IRouteHandler<boolean> {
    
  private readonly _logger = getLogger(QuestionCreateHandler.name);

  constructor(private readonly _surveyService: SurveyQuestionService) {
  }

  public handle(req: Request, res: Response): void {
    const question: SurveyQuestion = req.body; // Assumes SurveyQuestion matches the body structure.
    if (this.validation(question)) {
      this.execute(req)
        .then(success => {
          if (success) {
            this._logger.info(`Successfully created survey question`);
            res.status(201).send("Successfully created survey question");
          } else {
            this._logger.error(`Failed to create survey question`);
            res.status(400).send("Failed to create survey question");
          }
        }).catch(err => {
          this._logger.error(`Failed to create survey question: ${err}`);
          res.status(500).send("Server failed to process request, please try again");
        });
    } else {
      this._logger.info("Validation failed for creating survey question");
      res.status(422).send("Invalid survey question data provided");
    }
  }

  public async execute(req: Request): Promise<boolean> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const question: SurveyQuestion = new SurveyQuestion(-1, req.body.question, req.body.standard, req.body.type, req.body.rankOrder, req.body.parentId ?? null);
    return this._surveyService.create(question);
  }

  public validation(question: any): boolean {
    return question && !nullOrUndefined(question.question) && !nullOrUndefined(question.standard) && !nullOrUndefined(question.type);
  };
}
