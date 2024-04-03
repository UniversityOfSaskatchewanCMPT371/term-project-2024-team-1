import "reflect-metadata";
import { QuestionController } from "@app/adapter/Controllers/QuestionContoller";
import { SurveyController } from "@app/adapter/Controllers/SurveyController";
import { UserController } from "@app/adapter/Controllers/UserController";
import { registerAllDependencies } from "@app/adapter/DependencyInjections";
import { HOST, NODE_ENV, PORT } from "@resources/config";
import cors from "cors";
import express, { Express, Request, Response } from "express";
import { container } from "tsyringe";
import { AnswerController } from "@app/adapter/Controllers/AnswerController";

registerAllDependencies();

export const app: Express = express();

const surveyController: SurveyController = container.resolve(SurveyController);
const answerController: AnswerController = container.resolve(AnswerController);
const userController: UserController = container.resolve(UserController);
const questionController: QuestionController = container.resolve(QuestionController);

// const userRoute: Router = require("@app/adapter/Controllers/UserController");

console.log(`NODE_ENV=${NODE_ENV}`);

app.use(cors());
app.use(express.json());

app.use("/api", surveyController.getController());
app.use("/api", answerController.getController());
app.use("/api", userController.getController());
app.use("/api", questionController.getController());

app.get("/", (req: Request, res: Response) => {
  res.send("Service Active");
});

if (NODE_ENV !== "test") {
  app.listen(PORT, HOST, () => {
    console.log(`APP LISTENING ON http://${HOST}:${PORT}`); 
  });
}

export default app;
