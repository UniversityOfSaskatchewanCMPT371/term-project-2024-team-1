import "reflect-metadata";
import express, { Request, Response, Router } from "express";
import { injectable, container } from "tsyringe";
import { QuestionGetAllHandler } from "@app/adapter/Controllers/Handlers/QuestionGetAllHandler";
import { QuestionCreateHandler } from "@app/adapter/Controllers/Handlers/CreateQuestionHandler";

@injectable()
export class QuestionController {
  private readonly _router: Router = express.Router();

  public constructor(
    private readonly _questionGetAllHandler: QuestionGetAllHandler = container.resolve(QuestionGetAllHandler),
    private readonly _questionCreateHandler: QuestionCreateHandler = container.resolve(QuestionCreateHandler)
  ) {}

  public getController(): Router {
    this._router.get("/question", (req: Request, res: Response) => {
      void this._questionGetAllHandler.handle(req, res);
    });

    this._router.post("/question", (req: Request, res: Response) => {
      void this._questionCreateHandler.handle(req, res);
    });
    
    return this._router;
  }
}
