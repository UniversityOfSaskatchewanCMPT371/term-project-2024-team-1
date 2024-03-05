import { UserService } from "@app/application/UserService";
import { User } from "@app/domain/User";
import { nullOrUndefined } from "@app/application/util";
import { IRouteHandler } from "@app/domain/interfaces/IRouteHandler";
import { Request, Response } from "express";
import { container, injectable } from "tsyringe";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "@resources/config";



@injectable()
export class LoginAuthHandler implements IRouteHandler<User | undefined> {
  

  constructor(private readonly _userService: UserService) {
    this._userService = container.resolve(UserService);
  }

  public handle(req: Request, res: Response): void {
    if (this.validation(req)) {
      const userId: string = req.body.userId;
      this.execute(req).then((user: User | undefined) => {
        if (user == null) {
          res.status(404).send("Incorrect userId or password");
        } else {
          const password: string = req.body.password;
          bcrypt.compare(password, user.password).then((isMatch: boolean) => {
            if (isMatch) {
              const accessToken: string = jwt.sign({ userId }, ACCESS_TOKEN_SECRET, { expiresIn: "10m" });
              res.status(200).json({ accessToken });
            } else {
              res.status(403).send("Incorrect userId or password");
            }
          }).catch((error: any) => {
            console.error("Error comparing passwords:", error);
            res.status(500).send("Internal server error");
          });
        }
      }).catch((error: any) => {
        console.error("Error executing user retrieval:", error);
        res.status(404).send("User not found, login failed");
      });
    } else {
      res.status(422).send("UserID and Password are required");
    }

  }

  public async execute(req: Request): Promise<User | undefined> {
    const userId: string = req.body.userId;
    const user: Promise<User | undefined> = this._userService.getById(userId);
    
    return user;
  }

  public validation(...args: any[]): boolean {
    const request: Request = args[0];
    return !nullOrUndefined(request.body) && !nullOrUndefined(request.body.userId && request.body.password);
  };

}
