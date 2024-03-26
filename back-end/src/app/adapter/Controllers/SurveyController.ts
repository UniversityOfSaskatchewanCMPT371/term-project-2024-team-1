import "reflect-metadata";
import express, { Request, Response, Router } from "express";
import { injectable } from "tsyringe";
import { SurveyAddHandler } from "./Handlers/SurveyAddHandler";
import { SurveyGetAllHandler } from "./Handlers/SurveyGetAllHandler";
// import { USER, authenticate } from "@app/application/util";



@injectable()
export class SurveyController {
  private readonly _router: Router = express.Router();

  public constructor(
    private readonly _surveyAddHandler: SurveyAddHandler,
    private readonly _surveyGetAllHandler: SurveyGetAllHandler) { }


  public getController(): Router {
    this._router.post("/survey", (req: Request, res: Response) => {
      void this._surveyAddHandler.handle(req, res);
    });

    this._router.get("/survey", (req: Request, res: Response) => {
      void this._surveyGetAllHandler.handle(req, res);
    });

    return this._router;
  }
}


