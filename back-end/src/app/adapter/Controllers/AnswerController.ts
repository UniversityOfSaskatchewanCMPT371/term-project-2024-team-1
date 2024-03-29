import express, { Router, Request, Response } from "express";
import { injectable } from "tsyringe";
import { AnswerUpdateHandler } from "./Handlers/AnswersUpdateHandler";
import { USER, authenticate } from "@app/application/util";
import { CreateAnswerHandler } from "./Handlers/CreateAnswerHandler";

@injectable()
export class AnswerController {
  private readonly _router: Router = express.Router();

  public constructor(private readonly _answerUpdateHandler: AnswerUpdateHandler,
    private readonly _createAnswerHandler: CreateAnswerHandler) { }

  public getController(): Router {
    this._router.patch("/answer", authenticate(USER), (req: Request, res: Response) => {
      this._answerUpdateHandler.handle(req, res);
    });

    this._router.post("/survey/answer", authenticate(USER), (req: Request, res: Response) => {
      void this._createAnswerHandler.handle(req, res);
    });

    return this._router;
  }
}
