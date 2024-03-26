import express, { Router, Request, Response } from "express";
import { injectable } from "tsyringe";
import { AnswerUpdateHandler } from "./Handlers/AnswersUpdateHandler";
import { USER, authenticate } from "@app/application/util";

@injectable()
export class AnswerController {
  private readonly _router: Router = express.Router();

  public constructor(private readonly _answerUpdateHandler: AnswerUpdateHandler) { }

  public getController(): Router {
    this._router.patch("/answer", authenticate(USER), (req: Request, res: Response) => {
      this._answerUpdateHandler.handle(req, res);
    });

    return this._router;
  }
}
