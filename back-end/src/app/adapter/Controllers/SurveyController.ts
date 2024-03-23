
import express, { Request, Response, Router } from "express";
import { container } from "tsyringe";
import { SurveyAddHandler } from "./Handlers/SurveyAddHandler";
import { SurveyGetUsersSubmittedHandler } from "./Handlers/SurveyGetUsersSubmittedHandler";
// import { authenticate, ADMIN } from "@app/application/util";

const router: Router = express.Router();

const surveyAddHandler: SurveyAddHandler = container.resolve(SurveyAddHandler);
const surveyGetUsersSubmittedHandler: SurveyGetUsersSubmittedHandler = container.resolve(SurveyGetUsersSubmittedHandler);

router.post("/survey", (req: Request, res: Response) => {
  void surveyAddHandler.handle(req, res);
});

router.get("/survey/:surveyId/user", (req: Request, res: Response) => {
  surveyGetUsersSubmittedHandler.handle(req, res);
});
module.exports = router;
