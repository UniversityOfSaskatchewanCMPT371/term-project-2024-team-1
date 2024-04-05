import { ADMIN, authenticate } from "@app/application/util";
import express, { Request, Response, Router } from "express";
import { injectable } from "tsyringe";
import { CreateUserHandler } from "./Handlers/CreateUserHandler";
import { LoginAuthHandler } from "./Handlers/LoginAuthHandler";
import { SignUpHandler } from "./Handlers/SignUpHandler";
import { UserDeleteHandler } from "./Handlers/UserDeleteHandler";
import { UserGetAllHandler } from "./Handlers/UserGetAllHandler";
import { RequestGetAllHandler } from "./Handlers/RequestGetAllHandler";


@injectable()
export class UserController {
  private readonly _router: Router = express.Router();

  public constructor(private readonly _userGetAllHandler: UserGetAllHandler,
    private readonly _userDeleteHandler: UserDeleteHandler,
    private readonly _loginAuthHandler: LoginAuthHandler,
    private readonly _signUpHandler: SignUpHandler,
    private readonly _createUserHandler: CreateUserHandler,
    private readonly _requestGetAllHandler: RequestGetAllHandler) {

  }

  public getController(): Router {

    this._router.get("/user", authenticate(ADMIN), (req: Request, res: Response) => {
      this._userGetAllHandler.handle(req, res);
    });
      
    this._router.delete("/user/:userId", authenticate(ADMIN), (req: Request, res: Response) => {
      this._userDeleteHandler.handle(req, res);
    });
      
    this._router.patch("/user/request/:requestId", authenticate(ADMIN), (req: Request, res: Response) => {
      this._createUserHandler.handle(req, res);
    });

    this._router.get("/user/request", authenticate(ADMIN), (req: Request, res: Response) => {
      this._requestGetAllHandler.handle(req, res);
    });
      
    this._router.post("/login", (req: Request, res: Response) => {
      this._loginAuthHandler.handle(req, res);
    });
      
    this._router.post("/signup", (req: Request, res: Response) => {
      this._signUpHandler.handle(req, res);
    });

    return this._router;
  }

    
}

