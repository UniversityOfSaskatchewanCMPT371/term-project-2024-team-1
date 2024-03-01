
import express, { Request, Response } from "express";
import { container } from "tsyringe";
import { UserGetAllHandler } from "./Handlers/UserGetAllHandler";

// eslint-disable-next-line @typescript-eslint/typedef
const router = express.Router();

const userGetAllHandler: UserGetAllHandler = container.resolve(UserGetAllHandler);

router.get("/users", (req: Request, res: Response) => {
  userGetAllHandler.handle(req, res);
});

module.exports = router;
