import "reflect-metadata";
import express, { Request, Response, Router } from "express";
import { injectable } from "tsyringe";
import { SurveyAddHandler } from "./Handlers/SurveyAddHandler";
import { SurveyGetUsersSubmittedHandler } from "./Handlers/SurveyGetUsersSubmittedHandler";
import { authenticate, ADMIN } from "@app/application/util";



@injectable()
export class SurveyController {
  private readonly _router: Router = express.Router();

  public constructor(private readonly _surveyAddHandler: SurveyAddHandler,
    private readonly _surveyGetUsersSubmittedHandler: SurveyGetUsersSubmittedHandler) { }

  public getController(): Router {
    this._router.post("/survey", (req: Request, res: Response) => {
      void this._surveyAddHandler.handle(req, res);
    });

    this._router.get("/survey/:surveyId/user", authenticate(ADMIN), (req: Request, res: Response) => {
      this._surveyGetUsersSubmittedHandler.handle(req, res);
    });
    this._router.get("/survey/:surveyId/user/:userId", authenticate(ADMIN), (req: Request, res: Response) => {
      this._surveyGetUsersSubmittedHandler.handle(req, res);
    });

    return this._router;
  }
}
