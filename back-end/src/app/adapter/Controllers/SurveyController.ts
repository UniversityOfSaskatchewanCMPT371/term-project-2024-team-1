/* eslint-disable */
import express, { Request, Response, Router } from "express";
import { container } from "tsyringe";
import { SurveyAddHandler } from "./Handlers/SurveyAddHandler";

const router: Router = express.Router();

const surveyAddHandler: SurveyAddHandler = container.resolve(SurveyAddHandler);

router.post("/survey", (req: Request, res: Response) => {
  console.log
  surveyAddHandler.handle(req, res);
});

module.exports = router;
