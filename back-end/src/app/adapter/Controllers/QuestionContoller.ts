import { QuestionCreateHandler } from "@app/adapter/Controllers/Handlers/CreateQuestionHandler";
import { QuestionGetAllHandler } from "@app/adapter/Controllers/Handlers/QuestionGetAllHandler";
import express, { Request, Response, Router } from "express";
import { injectable } from "tsyringe";
import { SurveyQuestionAddHandler } from "./Handlers/SurveyQuestionAddHandler";


@injectable()
export class QuestionController {
  private readonly _router: Router = express.Router();

  public constructor(private readonly _questionGetAllHandler: QuestionGetAllHandler,
    private readonly _questionCreateHandler: QuestionCreateHandler, 
    private readonly _surveyQuestionAddHandler: SurveyQuestionAddHandler) { }

  public getController(): Router {
    this._router.get("/question", (req: Request, res: Response) => {
      this._questionGetAllHandler.handle(req, res);
    });

    this._router.post("/question", (req: Request, res: Response) => {
      this._questionCreateHandler.handle(req, res);
    });

    this._router.post("/question/:questionId/:surveyId", (req: Request, res: Response) => {
      this._surveyQuestionAddHandler.handle(req, res);
    });

    return this._router;
  }
}
