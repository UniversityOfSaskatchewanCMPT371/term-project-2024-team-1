import "reflect-metadata";
import express, { Request, Response, Express } from "express";
import { container } from "tsyringe";
import { TestService } from "@app/application/TestService";
import { NODE_ENV, HOST, PORT } from "@resources/config";
import { UserSQL } from "@app/adapter/SQLRepositories/User/UserSQL";
import { query } from "@app/adapter/SQLRepositories/SQLConfiguration";
import log4jsConfig from "@resources/log4js-config.json";
import log4js from "log4js";

console.log(`NODE_ENV=${NODE_ENV}`);

const app: Express = express();

log4js.configure(log4jsConfig);
const infoLogger: log4js.Logger = log4js.getLogger("info");
const debugLogger: log4js.Logger = log4js.getLogger("debug");
const errorLogger: log4js.Logger = log4js.getLogger("error");
const warnLogger: log4js.Logger = log4js.getLogger("warn");

app.get("/", (req: Request, res: Response) => {
  const t: TestService = container.resolve(TestService);
  t.call();
  res.send("Hello World !!");
});

app.get("/dbHit", (req: Request, res: Response) => {
  const result: Promise<string> = query("SELECT * FROM VetClinics");
  
  result.then(result => {
    res.send(result[0]);
  }).catch(error => {
    console.log(error);
    errorLogger.error("Database query failed", error);
  });
});

app.listen(PORT, HOST, () => {
  infoLogger.info("Testing INFO logs");
  errorLogger.error("Testing ERROR logs");
  debugLogger.debug("Testing DEBUG logs");
  warnLogger.warn("Testing WARN logs");
  console.log(`APP LISTENING ON http://${HOST}:${PORT}`);
});

container.register("User", { useClass: UserSQL });

