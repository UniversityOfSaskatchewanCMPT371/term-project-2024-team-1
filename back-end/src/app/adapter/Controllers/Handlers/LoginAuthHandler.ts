import { UserService } from "@app/application/UserService";
import { nullOrUndefined } from "@app/application/util";
import { User } from "@app/domain/User";
import { LoggerFactory } from "@app/domain/factory/LoggerFactory";
import { ILogger } from "@app/domain/interfaces/ILogger";
import { IRouteHandler } from "@app/domain/interfaces/IRouteHandler";
import { ACCESS_TOKEN_SECRET } from "@resources/config";
import log4jsConfig from "@resources/log4js-config.json";
import assert from "assert";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { configure } from "log4js";
import { injectable } from "tsyringe";
/* eslint-disable @typescript-eslint/naming-convention */
configure(log4jsConfig);


@injectable()
export class LoginAuthHandler implements IRouteHandler<User | null> {
  
  private readonly _logger: ILogger = LoggerFactory.getLogger(LoginAuthHandler.name);
  
  public constructor(private readonly _userService: UserService) { }

  public handle(req: Request, res: Response): void {
    if (this.validation(req)) {
      this._logger.INFO("validation passed");
      this.execute(req).then((user: User | null) => {
        if (user == null) {
          this._logger.INFO("Incorrect userId or password");
          res.status(404).send("Incorrect userId or password");
        } else {
          const password: string = req.body.password;
          bcrypt.compare(password, user.password).then((isMatch: boolean) => {
            if (isMatch) {
              this._logger.INFO("password matched");
              if (user) {
                const role: string = user?.isAdmin ? "ADMIN" : "USER";
                assert(!nullOrUndefined(role), "Role should not be null or undefined");
                const userId: string | undefined = user?.userId;
                assert(!nullOrUndefined(userId), "UserId should not be null or undefined");
                const accessToken: string = jwt.sign({ userId }, ACCESS_TOKEN_SECRET);
                assert(!nullOrUndefined(accessToken), "Access token should not be null or undefined");
                res.status(200).json({ userId, role, accessToken });
              } else {
                this._logger.INFO("Error executing user retrieval");
                res.status(404).send("Incorrect userId or password");
              }
            } else {
              res.status(403).send("Incorrect userId or password");
            }
          }).catch(() => {
            this._logger.ERROR("Error comparing passwords");
            res.status(500).send("Internal server error");
          });
        }
      }).catch(() => {
        this._logger.ERROR("Error executing user retrieval");
        res.status(404).send("Incorrect userId or password");
      });
    } else {
      this._logger.INFO("UserId and Password are required");
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
