import { UserService } from "@app/application/UserService";
import { nullOrUndefined } from "@app/application/util";
import { LoggerFactory } from "@app/domain/factory/LoggerFactory";
import { ILogger } from "@app/domain/interfaces/ILogger";
import { IRouteHandler } from "@app/domain/interfaces/IRouteHandler";
import { Request, Response } from "express";
import { delay, inject, injectable } from "tsyringe";

@injectable()
export class UserDeleteHandler implements IRouteHandler<boolean> {
  private readonly _logger: ILogger = LoggerFactory.getLogger(UserDeleteHandler.name);
  
  constructor(@inject(delay(() => UserService)) private readonly _userService: UserService) {
  // constructor(private readonly _userService: UserService) {
    // this._userService = container.resolve(UserService);
  }

  public handle(req: Request, res: Response): void {
    if (this.validation(req)) {
      const userId: string = req.params.userId;
      this.execute(req)
        .then(success => {
          if (success) {
            this._logger.INFO(`Successfully deleted user ${userId}`);
            res.status(200).send(`Successfully removed user ${userId}`);
          } else {
            this._logger.INFO(`Failed to delete ${userId}, user doesn't exist`);
            res.status(404).send(`User ${userId} not found, delete was not performed`);
          }
        }).catch(err => {
          this._logger.ERROR(`Failed to delete ${userId}, error occured: ${err}`);
          res.status(500).send("Server failed to process request, please try again");
        });
    } else {
      this._logger.INFO("Failed to delete, userId wasn't provided");
      res.status(422).send("UserID is required");
    }
  }

  public async execute(req: Request): Promise<boolean> {
    const userId: string = req.params.userId;
    return this._userService.delete(userId);
  }

  public validation(...args: any[]): boolean {
    const request: Request = args[0];
    return !nullOrUndefined(request.params) && !nullOrUndefined(request.params.userId);
  };

}
