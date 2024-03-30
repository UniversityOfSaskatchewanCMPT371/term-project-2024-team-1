import "reflect-metadata";
import express, { Request, Response, Router } from "express";
import { injectable } from "tsyringe";
import { SurveyAddHandler } from "./Handlers/SurveyAddHandler";
import { SurveyGetUsersSubmittedHandler } from "./Handlers/SurveyGetUsersSubmittedHandler";
import { authenticate, ADMIN, USER } from "@app/application/util";
import { SurveyGetAllHandler } from "./Handlers/SurveyGetAllHandler";
import { SurveyGetHandler } from "./Handlers/SurveyGetHandler";
import { SurveyQuestionAddHandler } from "./Handlers/SurveyQuestionAddHandler";



@injectable()
export class SurveyController {
  private readonly _router: Router = express.Router();

  public constructor(private readonly _surveyAddHandler: SurveyAddHandler,
    private readonly _surveyGetUsersSubmittedHandler: SurveyGetUsersSubmittedHandler,
    private readonly _surveyGetAllHandler: SurveyGetAllHandler,
    private readonly _surveyGetHandler: SurveyGetHandler, 
    private readonly _surveyQuestionAddHandler: SurveyQuestionAddHandler) { }

  public getController(): Router {
    this._router.get("/survey", authenticate(USER), (req: Request, res: Response) => {
      this._surveyGetAllHandler.handle(req, res);
    });

    this._router.get("/survey/:surveyId", authenticate(USER), (req: Request, res: Response) => {
      void this._surveyGetHandler.handle(req, res);
    });

    this._router.post("/survey", authenticate(ADMIN), (req: Request, res: Response) => {
      void this._surveyAddHandler.handle(req, res);
    });

    this._router.get("/survey/:surveyId/user", authenticate(ADMIN), (req: Request, res: Response) => {
      void this._surveyGetUsersSubmittedHandler.handle(req, res);
    });

    this._router.post("/survey/question", authenticate(ADMIN), (req: Request, res: Response) => {
      this._surveyQuestionAddHandler.handle(req, res);
    });

    return this._router;
  }
}
