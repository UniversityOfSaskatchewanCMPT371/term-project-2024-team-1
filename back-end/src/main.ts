import { SurveyController } from "@app/adapter/Controllers/SurveyController";
import { UserController } from "@app/adapter/Controllers/UserController";
import { registerAllDependencies } from "@app/adapter/DependencyInjections";
import { HOST, NODE_ENV, PORT } from "@resources/config";
import log4jsConfig from "@resources/log4js-config.json";
import cors from "cors";
import express, { Express, Request, Response } from "express";
import { Logger, configure, getLogger } from "log4js";
import "reflect-metadata";
import { container } from "tsyringe";
// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
configure(log4jsConfig);

registerAllDependencies();

export const app: Express = express();
const logger: Logger = getLogger("info"); // logger for info

const surveyController: SurveyController = container.resolve(SurveyController);
const userController: UserController = container.resolve(UserController);

// const userRoute: Router = require("@app/adapter/Controllers/UserController");

console.log(`NODE_ENV=${NODE_ENV}`);

app.use(cors());
app.use(express.json());
app.use("/api", surveyController.getController());
app.use("/api", userController.getController()); // confirm

app.get("/", (req: Request, res: Response) => {
  logger.info("GET request received");
  res.send("Service Active");
});

if (NODE_ENV !== "test") {
  app.listen(PORT, HOST, () => {
    logger.error("Testing ERROR logs");
    logger.debug("Testing DEBUG logs");
    console.log(`APP LISTENING ON http://${HOST}:${PORT}`); 
  });
}

export default app;
