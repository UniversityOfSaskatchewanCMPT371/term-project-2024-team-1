
import { ADMIN, USER, authenticate } from "@app/application/util";
import express, { Request, Response, Router } from "express";
import { container } from "tsyringe";
import { UserDeleteHandler } from "./Handlers/UserDeleteHandler";
import { UserDeleteHandler } from "./Handlers/UserDeleteHandler";
import { UserGetAllHandler } from "./Handlers/UserGetAllHandler";
import { LoginAuthHandler } from "./Handlers/LoginAuthHandler";

const router: Router = express.Router();

const userGetAllHandler: UserGetAllHandler = container.resolve(UserGetAllHandler);
const userDeleteHandler: UserDeleteHandler = container.resolve(UserDeleteHandler);
const loginAuthHandler: LoginAuthHandler = container.resolve(LoginAuthHandler);

router.get("/users", authenticate(USER), (req: Request, res: Response) => {
  userGetAllHandler.handle(req, res);
});

router.delete("/user/:userId", authenticate(ADMIN), (req: Request, res: Response) => {
  userDeleteHandler.handle(req, res);
});

router.post("/login", (req: Request, res: Response) => {
  loginAuthHandler.handle(req, res);
});

module.exports = router;
