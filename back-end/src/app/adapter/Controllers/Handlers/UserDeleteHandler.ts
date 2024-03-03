import { UserService } from "@app/application/UserService";
import { nullOrUndefined } from "@app/application/util";
import { IRouteHandler } from "@app/domain/interfaces/IRouteHandler";
import { Request, Response } from "express";
import { container, injectable } from "tsyringe";

@injectable()
export class UserDeleteHandler implements IRouteHandler<boolean> {
  

  constructor(private readonly _userService: UserService) {
    this._userService = container.resolve(UserService);
  }

  public handle(req: Request, res: Response): void {
    if (this.validation(req)) {
      const userId: string = req.params.userId;
      this.execute(req)
        .then(success => {
          if (success) {
            res.status(200).send(`Successfully removed user ${userId}`);
          } else {
            res.status(404).send(`User ${userId} not found, delete was not performed`);
          }
        }).catch(err => {
          console.error(err);
          res.status(500).send("Server failed to process request, please try again");
        });
    } else {
      res.status(422).send("UserID is required");
    }
  }

  public async execute(req: Request): Promise<boolean> {
    const userId: string = req.params.userId;
    return this._userService.delete(userId);
  }

  public validation(...args: any[]): boolean {
    const request: Request = args[0];
    console.log("VALIDATION METHOD", request);
    return !nullOrUndefined(request.params) && !nullOrUndefined(request.params.userId);
  };

}
