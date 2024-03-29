import "reflect-metadata";
import express, { Request, Response, Express } from "express";
import { container } from "tsyringe";
import { TestService } from "@app/application/TestService";
import { Logger, configure, getLogger } from "log4js";
import { NODE_ENV, HOST, PORT } from "@resources/config";
import { UserSQL } from "@app/adapter/interface_implementation/User/SQL/UserSQL";
configure("src/resources/log4js-config.json");


const app: Express = express();
const infoLogger: Logger = getLogger("info"); // logger for info
const errLogger: Logger = getLogger("error"); // logger for error
const debugLogger: Logger = getLogger("debug"); // logger for debug

console.log(`NODE_ENV=${NODE_ENV}`);

app.get("/", (req: Request, res: Response) => {
  infoLogger.info("GET request received");
  const t: TestService = container.resolve(TestService);
  t.call();
  res.send("Hello World !!");
});

app.listen(PORT, HOST, () => {
  errLogger.error("Testing ERROR logs");
  debugLogger.debug("Testing DEBUG logs");
  console.log(`APP LISTENING ON http://${HOST}:${PORT}`); 
});

container.register("User", { useClass: UserSQL });
