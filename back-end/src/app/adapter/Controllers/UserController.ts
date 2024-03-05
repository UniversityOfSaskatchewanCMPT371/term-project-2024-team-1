
import { ADMIN, authenticate } from "@app/application/util";
import express, { Request, Response, Router } from "express";
import { container } from "tsyringe";
import { UserDeleteHandler } from "./Handlers/UserDeleteHandler";
import { UserGetAllHandler } from "./Handlers/UserGetAllHandler";

const router: Router = express.Router();

const userGetAllHandler: UserGetAllHandler = container.resolve(UserGetAllHandler);
const userDeleteHandler: UserDeleteHandler = container.resolve(UserDeleteHandler);

router.get("/users", (req: Request, res: Response) => {
  userGetAllHandler.handle(req, res);
});

router.delete("/user/:userId", authenticate(ADMIN), (req: Request, res: Response) => {
  userDeleteHandler.handle(req, res);
});

module.exports = router;
