import { UserService } from "@app/application/UserService";
import { User } from "@app/domain/User";
import { IRouteHandler } from "@app/domain/interfaces/IRouteHandler";
import { Request, Response } from "express";
import { container, injectable } from "tsyringe";

@injectable()
export class UserGetAllHandler implements IRouteHandler<User[]> {
  

  constructor(private readonly _userService: UserService) {
    this._userService = container.resolve(UserService);
  }

  public handle(req: Request, res: Response): void {
    if (this.validation("test")) {
      this.execute(req)
        .then(success => {
          res.send(success);
        })
        .catch(error => {
          res.status(400).send(error);
        });
    } else {
      res.status(400);
    };
  }

  public async execute(req: Request): Promise<User[]> {
    const result: Promise<User[]> = this._userService.getAll();
    return result;
  }

  public validation(...args: any[]): boolean {

    return true;
  };

}
