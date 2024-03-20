/* eslint-disable @typescript-eslint/typedef */
import "reflect-metadata";
import express, { Router, Request, Response, Express } from "express";
import { Logger, configure, getLogger } from "log4js";
import { NODE_ENV, HOST, PORT } from "@resources/config";
import log4jsConfig from "@resources/log4js-config.json";
import { registerAllDependencies } from "@app/adapter/DependencyInjections";
import cors from "cors";
// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
configure(log4jsConfig);

registerAllDependencies();

export const app: Express = express();
const logger: Logger = getLogger("info"); // logger for info

const userRoute: Router = require("@app/adapter/Controllers/UserController");
const surveyRoute: Router = require("@app/adapter/Controllers/SurveyController");

console.log(`NODE_ENV=${NODE_ENV}`);

app.use(cors());
app.use(express.json());
app.use("/api", userRoute);
app.use("/api", surveyRoute);

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
