/* eslint-disable @typescript-eslint/naming-convention */
import { IRouteHandler } from "@app/domain/interfaces/IRouteHandler";
import { Request, Response } from "express";
import { delay, inject, injectable } from "tsyringe";
import { LoggerFactory } from "@app/domain/factory/LoggerFactory";
import { ILogger } from "@app/domain/interfaces/ILogger";
import { SurveyQuestionService } from "@app/application/SurveyQuestionService";
import { SurveyQuestion } from "@app/domain/SurveyQuestion";
import { nullOrUndefined } from "@app/application/util";

@injectable()
export class QuestionCreateHandler implements IRouteHandler<boolean> {
    
  private readonly _logger: ILogger = LoggerFactory.getLogger(QuestionCreateHandler.name);

  constructor(@inject(delay(() => SurveyQuestionService)) private readonly _surveyQuestionService: SurveyQuestionService) {
  }

  public handle(req: Request, res: Response): void {
    if (!this.validation(req)) {
      this._logger.INFO("Failed to validate survey question request");
      res.status(422).send("Survey question is required");
      return;
    }
    this._logger.INFO("Successfully validated survey question request");
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
    const id: number = -1;
    const standard: boolean = Boolean(req.body.standard);
    const question: string = req.body.question;
    const type: string = req.body.type;
    const surveyQuestion: SurveyQuestion = new SurveyQuestion(id, question, standard, type);
    return this._surveyQuestionService.create(surveyQuestion);
  }

  public validation(...args: any[]): boolean {
    const request: Request = args[0];
    const isValid: boolean = 
    !nullOrUndefined(request.body) && 
    !nullOrUndefined(request.body.question) && 
    !nullOrUndefined(request.body.standard) && 
    !nullOrUndefined(request.body.type) && 
    (typeof request.body.standard === "boolean" || request.body.standard === "true" || request.body.standard === "false");
    if (request.body.parantId !== null && request.body.parantId !== undefined) {
      return (
        isValid &&
        !isNaN(Number(request.body.parentId)));
    }
    return isValid;

  };
}
