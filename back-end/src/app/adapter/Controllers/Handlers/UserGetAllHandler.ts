import { UserDTO } from "@app/adapter/DTOs/UserDTO";
import { UserService } from "@app/application/UserService";
import { User } from "@app/domain/User";
import { IRouteHandler } from "@app/domain/interfaces/IRouteHandler";
import log4jsConfig from "@resources/log4js-config.json";
import { Request, Response } from "express";
import { configure, getLogger } from "log4js";
import { injectable } from "tsyringe";
// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
configure(log4jsConfig);

@injectable()
export class UserGetAllHandler implements IRouteHandler<UserDTO[]> {
  
  private readonly _logger = getLogger(UserGetAllHandler.name);
  
  // constructor(@inject(delay(() => UserService)) private readonly _userService: UserService) {}
  constructor(private readonly _userService: UserService) {
    // this._userService = container.resolve(UserService);
  }

  public handle(req: Request, res: Response): void {
    this.execute(req)
      .then(userDTOs => {
        this._logger.info("Retrieved all users");
        res.status(200).send(userDTOs);
      })
      .catch(error => {
        this._logger.error(error);
        res.status(500).send("Server failed to retrieve users, please try again.");
      });
  }

  public async execute(req: Request): Promise<UserDTO[]> {
    const users: User[] = await this._userService.getAll();
    const userDTOs: UserDTO[] = users.map(user => new UserDTO(user.userId, user.isAdmin));
    return userDTOs;
  }

  public validation(...args: any[]): boolean {
    return true;
  };

}
