
import express, { Request, Response } from "express";
import { container } from "tsyringe";
import { UserGetAllHandler } from "./Handlers/UserGetAllHandler";
import { SignUpHandler } from "./Handlers/SIgnUpHandler";

// eslint-disable-next-line @typescript-eslint/typedef
const router = express.Router();

const userGetAllHandler: UserGetAllHandler = container.resolve(UserGetAllHandler);
const signUpHandler: SignUpHandler = container.resolve(SignUpHandler);

router.get("/users", (req: Request, res: Response) => {
  userGetAllHandler.handle(req, res);
});

router.post("/signup", (req: Request, res: Response) => {
  signUpHandler.handle(req, res);
});

module.exports = router;
