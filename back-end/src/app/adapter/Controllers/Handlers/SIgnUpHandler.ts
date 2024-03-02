import { UserService } from "@app/application/UserService";
import { User } from "@app/domain/User";
import { IRouteHandler } from "@app/domain/interfaces/IRouteHandler";
import { Request, Response } from "express";
import { container, injectable } from "tsyringe";

@injectable()
export class SignUpHandler implements IRouteHandler<boolean> {
  constructor(private readonly _userService: UserService) {
    this._userService = container.resolve(UserService);
  }

  public handle(req: Request, res: Response): void {
    const email: string = req.body.email;
    const password: string = req.body.password;
    const clinicID: number = req.body.clinicID;

    const userInstance: User = new User("", password, email, clinicID);

    if (this.validation(userInstance.email, userInstance.password)) {
      try {
        res.status(200).json({ user: userInstance }); 
      } catch (error) {
        res.status(400).send("ERROR: Failed to sign up user");
      }
    } else {
      res.status(406).send("ERROR: Not a valid email or password.");
    }
  };

  public async execute(req: Request): Promise<boolean> {
    // const { email, password, clinicID } = req.body;
    const email: string = req.body.email;
    const password: string = req.body.password;
    const clinicID: number = req.body.clinicID;

    const user: User = new User("", password, email, clinicID);

    const result: Promise<boolean> = this._userService.create(user);
    return result;
  };

  public validation(...args: any[]): boolean {
    const email: string = args[0];
    const password: string = args[1];

    return this.emailValidation(email) && this.passwordValidation(password);
  };

  private emailValidation(email: string): boolean {
    const pattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
  }

  private passwordValidation(password: string): boolean {
    const pattern: RegExp = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
    return pattern.test(password);
  }
}
