import "reflect-metadata";
import { query } from "@app/adapter/SQLRepositories/SQLConfiguration";
import { UserSQL } from "@app/adapter/SQLRepositories/User/UserSQL";
import { TestService } from "@app/application/TestService";
import { UserService } from "@app/application/UserService";
import { User } from "@app/domain/User";
import { HOST, NODE_ENV, PORT } from "@resources/config";
import express, { Express, Request, Response } from "express";
import { Logger, configure, getLogger } from "log4js";
import { container } from "tsyringe";
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

app.get("/dbHit", (req: Request, res: Response) => {
  const result: Promise<string> = query("SELECT * FROM VetClinics");
  
  result.then(result => {
    console.log(result);
    res.send(result[0]);
  }).catch(error => {
    console.log(error);
  });

});

app.get("/users", (req: Request, res: Response) => {
  const userService: UserService = container.resolve(UserService);
  const result: Promise<User[]> = userService.getAll();
  result.then(resolve => {
    res.send(resolve);
  }).catch(error => {
    console.log(error);
  });
}
);

// app.get("/users", (req: Request, res: Response) => {

//   const userSQL: UserSQL = new UserSQL();
  
//   userSQL.getAll()
//     .then(users => {
//       console.log(users);
//       res.json(users);
//     })
//     .catch(error => {
//       console.error("Error fetching users:", error);
//       res.status(500).json({ error: "Internal server error" });
//     });
// });


app.listen(PORT, HOST, () => {
  errLogger.error("Testing ERROR logs");
  debugLogger.debug("Testing DEBUG logs");
  console.log(`APP LISTENING ON http://${HOST}:${PORT}`);
});

container.register("User", { useClass: UserSQL });
