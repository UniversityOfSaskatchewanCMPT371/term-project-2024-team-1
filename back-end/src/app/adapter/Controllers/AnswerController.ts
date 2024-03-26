import "reflect-metadata";
import express, { Request, Response, Router } from "express";
import { injectable } from "tsyringe";
// import { USER, authenticate } from "@app/application/util";
import { CreateAnswerHandler } from "./Handlers/CreateAnswerHandler";
import { UpdateAnswerHandler } from "./Handlers/UpdateAnswerHandler";



@injectable()
export class AnswerController {
  private readonly _router: Router = express.Router();

  public constructor(
    private readonly _createAnswerHandler: CreateAnswerHandler,
    private readonly _updateAnswerHandler: UpdateAnswerHandler) { }

    
  public getController(): Router {
    this._router.post("/survey/:surveyId/answer", (req: Request, res: Response) => {
      void this._createAnswerHandler.handle(req, res);
    });

    this._router.patch("/survey/:surveyId/answer/:answerId", (req: Request, res: Response) => {
      void this._updateAnswerHandler.handle(req, res);
    });

    return this._router;
  }
}


