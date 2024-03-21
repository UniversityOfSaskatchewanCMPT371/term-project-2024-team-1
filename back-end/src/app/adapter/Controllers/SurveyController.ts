import "reflect-metadata";
import express, { Request, Response, Router } from "express";
import { injectable } from "tsyringe";
import { SurveyAddHandler } from "./Handlers/SurveyAddHandler";



@injectable()
export class SurveyController {
  private readonly _router: Router = express.Router();

  public constructor(private readonly _surveyAddHandler: SurveyAddHandler) { }

  public getController(): Router {
    this._router.post("/survey", (req: Request, res: Response) => {
      void this._surveyAddHandler.handle(req, res);
    });

    return this._router;
  }
}


