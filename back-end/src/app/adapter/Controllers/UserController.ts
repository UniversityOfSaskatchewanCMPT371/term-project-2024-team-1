import { ADMIN, authenticate } from "@app/application/util";
import express, { Request, Response, Router } from "express";
import { container } from "tsyringe";
import { UserDeleteHandler } from "./Handlers/UserDeleteHandler";
import { UserGetAllHandler } from "./Handlers/UserGetAllHandler";
import { LoginAuthHandler } from "./Handlers/LoginAuthHandler";
import { SignUpHandler } from "./Handlers/SignUpHandler";
import { CreateUserHandler } from "./Handlers/CreateUserHandler";



const userGetAllHandler: UserGetAllHandler = container.resolve(UserGetAllHandler);
const userDeleteHandler: UserDeleteHandler = container.resolve(UserDeleteHandler);
const loginAuthHandler: LoginAuthHandler = container.resolve(LoginAuthHandler);
const signUpHandler: SignUpHandler = container.resolve(SignUpHandler);
const createUserHandler: CreateUserHandler = container.resolve(CreateUserHandler);
export const router: Router = express.Router();

router.get("/user", authenticate(ADMIN), (req: Request, res: Response) => {
  userGetAllHandler.handle(req, res);
});

router.delete("/user/:userId", authenticate(ADMIN), (req: Request, res: Response) => {
  userDeleteHandler.handle(req, res);
});

router.post("/signup", authenticate(ADMIN), (req: Request, res: Response) => {
  createUserHandler.handle(req, res);
});

router.post("/login", (req: Request, res: Response) => {
  loginAuthHandler.handle(req, res);
});

router.post("/signup", (req: Request, res: Response) => {
  signUpHandler.handle(req, res);
});

module.exports = router;
