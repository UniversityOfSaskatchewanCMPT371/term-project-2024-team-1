import { UserService } from "@app/application/UserService";
import { User } from "@app/domain/User";
import { nullOrUndefined } from "@app/application/util";
import { IRouteHandler } from "@app/domain/interfaces/IRouteHandler";
import { Request, Response } from "express";
import { container, injectable } from "tsyringe";
import { configure, getLogger } from "log4js";
import log4jsConfig from "@resources/log4js-config.json";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "@resources/config";
import { assert } from "console";
/* eslint-disable @typescript-eslint/naming-convention */
configure(log4jsConfig);


@injectable()
export class LoginAuthHandler implements IRouteHandler<User | null> {
  
  private readonly _logger = getLogger(LoginAuthHandler.name);

  constructor(private readonly _userService: UserService) {
    this._userService = container.resolve(UserService);
  }

  public handle(req: Request, res: Response): void {
    if (this.validation(req)) {
      const userIdEmail: string = req.body.userIdEmail;
      this.execute(req).then((user: User | null) => {
        if (user == null) {
          res.status(404).send("Incorrect userId or password");
        } else {
          const password: string = req.body.password;
          bcrypt.compare(password, user.password).then((isMatch: boolean) => {
            if (isMatch) {
              this._userService.get(userIdEmail).then((user) => {
                console.log(user);
                if (user) {
                  const role: string = user?.isAdmin ? "ADMIN" : "USER";
                  assert(!nullOrUndefined(role), "Role should not be null or undefined");
                  const userId: string | undefined = user?.userId;
                  console.log("userId", userId);
                  assert(!nullOrUndefined(userId), "UserId should not be null or undefined");
                  const accessToken: string = jwt.sign({ userId }, ACCESS_TOKEN_SECRET, { expiresIn: "10m" });
                  assert(!nullOrUndefined(accessToken), "Access token should not be null or undefined");
                  res.status(200).json({ userId, role, accessToken });
                } else {
                  this._logger.error("Error executing user retrieval");
                  res.status(404).send("Incorrect userId or password");
                }
                
              }).catch((error) => { 
                this._logger.error("Server Error: ", error);
              });
              
              
            } else {
              res.status(403).send("Incorrect userId or password");
            }
          }).catch((error: any) => {
            this._logger.error("Error comparing passwords:", error);
            res.status(500).send("Internal server error");
          });
        }
      }).catch((error: any) => {
        this._logger.error("Error executing user retrieval:", error);
        res.status(404).send("Incorrect userId or password");
      });
    } else {
      res.status(422).send("UserId and Password are required");
    }

  }

  public async execute(req: Request): Promise<User | null> {
    const userIdEmail: string = req.body.userIdEmail;
    const user: Promise<User | null> = this._userService.get(userIdEmail);
    
    return user;
  }

  public validation(...args: any[]): boolean {
    const request: Request = args[0];
    return !nullOrUndefined(request.body) && !nullOrUndefined(request.body.userIdEmail && request.body.password) && 
    (request.body.userIdEmail !== "" && request.body.password !== "");

  };

}
