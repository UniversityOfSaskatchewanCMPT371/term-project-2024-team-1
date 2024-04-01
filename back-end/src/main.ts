import "reflect-metadata";
import { QuestionController } from "@app/adapter/Controllers/QuestionContoller";
import { SurveyController } from "@app/adapter/Controllers/SurveyController";
import { UserController } from "@app/adapter/Controllers/UserController";
import { registerAllDependencies } from "@app/adapter/DependencyInjections";
import { HOST, NODE_ENV, PORT } from "@resources/config";
import cors from "cors";
import express, { Express, Request, Response } from "express";
import { container } from "tsyringe";
import { AnswerSQLRepository } from "@app/adapter/SQLRepositories/Survey/AnswerSQLRepository";
import { ISurveyAnswerRepository } from "@app/domain/interfaces/repositories/ISurveyAnswerRepository";
import { SurveyAnswer } from "@app/domain/SurveyAnswer";
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

app.get("/temp", (req: Request, res: Response) => {
  const answerRepo: ISurveyAnswerRepository = container.resolve(AnswerSQLRepository);
  const answers: SurveyAnswer[] = [
    new SurveyAnswer("user1", 1, "abc", 2, "aaa"),
    new SurveyAnswer("user2", 2, "abc", 3, "bbb")
  ];
  answerRepo.update(answers).then(result => {
    console.log(result);
    res.status(200).send(result);
  }).catch(e => {
    console.log(e);
    res.status(500).send(e);
  });
});

if (NODE_ENV !== "test") {
  app.listen(PORT, HOST, () => {
    console.log(`APP LISTENING ON http://${HOST}:${PORT}`); 
  });
}

export default app;
