import { QuestionCreateHandler } from "@app/adapter/Controllers/Handlers/CreateQuestionHandler";
import { QuestionGetAllHandler } from "@app/adapter/Controllers/Handlers/QuestionGetAllHandler";
import { ADMIN, authenticate } from "@app/application/util";
import express, { Request, Response, Router } from "express";
import { injectable } from "tsyringe";


@injectable()
export class QuestionController {
  private readonly _router: Router = express.Router();

  public constructor(private readonly _questionGetAllHandler: QuestionGetAllHandler,
    private readonly _questionCreateHandler: QuestionCreateHandler) { }

  public getController(): Router {
    this._router.get("/question", authenticate(ADMIN), (req: Request, res: Response) => {
      this._questionGetAllHandler.handle(req, res);
    });

    this._router.post("/question", authenticate(ADMIN), (req: Request, res: Response) => {
      this._questionCreateHandler.handle(req, res);
    });

    return this._router;
  }
}
