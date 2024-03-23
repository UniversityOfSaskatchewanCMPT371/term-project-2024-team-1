import "reflect-metadata";
import express, { Request, Response, Router } from "express";
import { injectable } from "tsyringe";
import { SurveyAddHandler } from "./Handlers/SurveyAddHandler";
import { SurveyQuestionAddHandler } from "./Handlers/SurveyQuestionAddHandler";
import { SurveyQuestionGetHandler } from "./Handlers/SurveyQuestionGetHandler";

@injectable()
export class SurveyController {
  private readonly _router: Router = express.Router();

  public constructor(
    private readonly _surveyAddHandler: SurveyAddHandler, 
    private readonly _surveyQuestionAddHandler: SurveyQuestionAddHandler,
    private readonly _surveyQuestionGetHandler: SurveyQuestionGetHandler
  ) {}

  public getController(): Router {
    this._router.post("/survey", (req: Request, res: Response) => {
      void this._surveyAddHandler.handle(req, res);
    });

    this._router.post("/survey/question", (req: Request, res: Response) => {
      void this._surveyQuestionAddHandler.handle(req, res);
    });

    this._router.get("/survey/question/:surveyId", (req: Request, res: Response) => {
      void this._surveyQuestionGetHandler.handle(req, res);
    });

    return this._router;
  }
}
