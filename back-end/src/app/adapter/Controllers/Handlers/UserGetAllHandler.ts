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

  public async handle(req: Request, res: Response): Promise<void> {
    try {
      const users: User[] = await this.execute(req);
      res.send(users);
    } catch (error) {
      console.error("Error occurred while fetching users:", error);
      res.status(500).send("Internal Server Error");
    }
  }

  public async execute(req: Request): Promise<User[]> {
    return await this._userService.getAll();
  }

  public validation(...args: any[]): boolean {
    return true; // Add your validation logic here if needed
  };
}
