import express, { Request, Response, Router } from "express";
import { container } from "tsyringe";
import { QuestionGetAllHandler } from "@app/adapter/Controllers/Handlers/QuestionGetAllHandler";
import { QuestionCreateHandler } from "@app/adapter/Controllers/Handlers/CreateQuestionHandler";

const router: Router = express.Router();

const questionGetAllHandler: QuestionGetAllHandler = container.resolve(QuestionGetAllHandler);
const questionCreateHandler: QuestionCreateHandler = container.resolve(QuestionCreateHandler);


// router.get("/surveys", (req: Request, res: Response) => {
//   surveyGetAllHandler.hand(req, res);
// });

// router.get("/survey/:surveyName", (req: Request, res: Response) => {
//   surveyGetHandler.hand(req, res);
// });

router.post("/question", (req: Request, res: Response) => {
  void questionGetAllHandler.handle(req, res);
});

router.post("/question:question", (req: Request, res: Response) => {
  void questionCreateHandler.handle(req, res);
});

// router.delete("/surveys/:surveyName", (req: Request, res: Response) => {
//   surveyDeleteHandler.handle(req, res);
// });



module.exports = router;
