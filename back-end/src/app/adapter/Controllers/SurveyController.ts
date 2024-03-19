import express, { Request, Response, Router } from "express";
import { container } from "tsyringe";
import { ADMIN, authenticate } from "@app/application/util";
// import { SurveyGetAllHandler } from "./Handlers/SurveyGetAllHandler";
// import { surveyGetHandler } from "./Handlers/SurveyGetHandler";
import { SurveyAddHandler } from "./Handlers/SurveyAddHandler";
// import { surveyDeleteHandler } from "./Handlers/SurveyDeleteHandler";

const router: Router = express.Router();

// const SurveyGetAllHandler: SurveyGetAllHandler = container.resolve(SurveyGetAllHandler);
// const surveyGetHandler: surveyGetHandler = container.resolve(SurveyGetHandler);
const surveyAddHandler: SurveyAddHandler = container.resolve(SurveyAddHandler);
// const surveyDeleteHandler: surveyDeleteHandler = container.resolve(SurveyDeleteHandler);


// router.get("/surveys", (req: Request, res: Response) => {
//   surveyGetAllHandler.hand(req, res);
// });

// router.get("/survey/:surveyName", (req: Request, res: Response) => {
//   surveyGetHandler.hand(req, res);
// });

router.post("/survey", authenticate(ADMIN), (req: Request, res: Response) => {
  void surveyAddHandler.handle(req, res);
});

// router.delete("/surveys/:surveyName", (req: Request, res: Response) => {
//   surveyDeleteHandler.handle(req, res);
// });



module.exports = router;
