import "reflect-metadata";
import express, { Request, Response, Router } from "express";
import { injectable } from "tsyringe";
import { SurveyAddHandler } from "./Handlers/SurveyAddHandler";
import { SurveyGetUsersSubmittedHandler } from "./Handlers/SurveyGetUsersSubmittedHandler";
import { authenticate, ADMIN } from "@app/application/util";
import { SurveyGetAllHandler } from "./Handlers/SurveyGetAllHandler";
import { SurveyGetAllResponseHandler } from "./Handlers/SurveyGetAllResponseHandler";



@injectable()
export class SurveyController {
  private readonly _router: Router = express.Router();

  public constructor(private readonly _surveyAddHandler: SurveyAddHandler,
    private readonly _surveyGetUsersSubmittedHandler: SurveyGetUsersSubmittedHandler,
    private readonly _surveyGetAllHandler: SurveyGetAllHandler,
    private readonly _surveyGetAllResponseHandler: SurveyGetAllResponseHandler) { }

  public getController(): Router {
    this._router.get("/survey", (req: Request, res: Response) => {
      this._surveyGetAllHandler.handle(req, res);
    });

    this._router.post("/survey", (req: Request, res: Response) => {
      void this._surveyAddHandler.handle(req, res);
    });

    this._router.get("/survey/:surveyId/user", authenticate(ADMIN), (req: Request, res: Response) => {
      this._surveyGetUsersSubmittedHandler.handle(req, res);
    });
    
    this._router.get("/survey/:surveyId/response", (req: Request, res: Response) => {
      this._surveyGetAllResponseHandler.handle(req, res);
    });

    return this._router;
  }
}
