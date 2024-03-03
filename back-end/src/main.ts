import "reflect-metadata";
import express, { Router, Request, Response, Express } from "express";
import { Logger, configure, getLogger } from "log4js";
import { NODE_ENV, HOST, PORT } from "@resources/config";
import { query } from "@app/adapter/SQLRepositories/SQLConfiguration";
import log4jsConfig from "@resources/log4js-config.json";
import { registerAllDependencies } from "@app/adapter/DependencyInjections";
// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
configure(log4jsConfig);

registerAllDependencies();

const app: Express = express();
const infoLogger: Logger = getLogger("info"); // logger for info
const errLogger: Logger = getLogger("error"); // logger for error
const debugLogger: Logger = getLogger("debug"); // logger for debug

const userRoute: Router = require("@app/adapter/Controllers/UserController");

console.log(`NODE_ENV=${NODE_ENV}`);

app.use(express.json());
app.use("/api", userRoute); // confirm

app.get("/", (req: Request, res: Response) => {
  infoLogger.info("GET request received");
  res.send("Hello World !!");
});

app.get("/dbHit", (req: Request, res: Response) => {
  const result: Promise<string> = query("SELECT * FROM VetClinics");
  
  result.then(result => {
    console.log(result);
    res.send(result[0]);
  }).catch(error => {
    console.log(error);
  });

});

app.listen(PORT, HOST, () => {
  errLogger.error("Testing ERROR logs");
  debugLogger.debug("Testing DEBUG logs");
  console.log(`APP LISTENING ON http://${HOST}:${PORT}`); 
});
