import "reflect-metadata";
import { SurveyController } from "@app/adapter/Controllers/SurveyController";
import { UserController } from "@app/adapter/Controllers/UserController";
import { registerAllDependencies } from "@app/adapter/DependencyInjections";
import { HOST, NODE_ENV, PORT } from "@resources/config";
import cors from "cors";
import express, { Express, Request, Response } from "express";
import { container } from "tsyringe";

registerAllDependencies();

export const app: Express = express();

const surveyController: SurveyController = container.resolve(SurveyController);
const userController: UserController = container.resolve(UserController);

console.log(`NODE_ENV=${NODE_ENV}`);

app.use(cors());
app.use(express.json());

app.use("/api", surveyController.getController());
app.use("/api", userController.getController());

app.get("/", (req: Request, res: Response) => {
  res.send("Service Active");
});

if (NODE_ENV !== "test") {
  app.listen(PORT, HOST, () => {
    console.log(`APP LISTENING ON http://${HOST}:${PORT}`); 
  });
}

export default app;
