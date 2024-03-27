import "reflect-metadata";
import express, { Request, Response, Router } from "express";
import { injectable } from "tsyringe";
import { QuestionCreateHandler } from "./Handlers/CreateQuestionHandler";



@injectable()
export class QuestionController {
  private readonly _router: Router = express.Router();

  public constructor(private readonly _questionAddHandler: QuestionCreateHandler) { }

  public getController(): Router {
    this._router.post("/question", (req: Request, res: Response) => {
      void this._questionAddHandler.handle(req, res);
    });

    return this._router;
  }
}
