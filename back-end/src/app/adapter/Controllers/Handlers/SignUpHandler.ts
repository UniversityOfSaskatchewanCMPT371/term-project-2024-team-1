import { UserRequestService } from "@app/application/UserRequestService";
import { RequestStatusEnum } from "@app/domain/RequestStatusEnum";
import { UserRequest } from "@app/domain/UserRequest";
import { Request, Response } from "express";
import { injectable } from "tsyringe";

import bcrypt from "bcrypt";

import { nullOrUndefined } from "@app/application/util";
import { RequestTypeEnum } from "@app/domain/RequestTypeEnum";
import { LoggerFactory } from "@app/domain/factory/LoggerFactory";
import { ILogger } from "@app/domain/interfaces/ILogger";
import { IRouteHandler } from "@app/domain/interfaces/IRouteHandler";

@injectable()
export class SignUpHandler implements IRouteHandler<boolean> {
  private readonly _logger: ILogger = LoggerFactory.getLogger(SignUpHandler.name);

  // constructor(@inject(delay(() => UserRequestService)) private readonly _userRequestService: UserRequestService) {
  constructor(private readonly _userRequestService: UserRequestService) {
    // this._userRequestService = container.resolve(UserRequestService);
  }

  public handle(req: Request, res: Response): void {
    if (this.validation(req)) {
      this._logger.INFO("validation passed");

      const email: string = req.body.email;
      const password: string = req.body.password;
      const clinic: string = req.body.clinic;

      this.execute(req).then((status: boolean) => {
        if (!status) {

          if (!this.emailValidation(email) && !this.passwordValidation(password)) {
            this._logger.INFO("Invalid email and password");
            res.status(400).send("Invalid email and password, please try again");
          } else if (!this.emailValidation(email)) {
            this._logger.INFO("Invalid email");
            res.status(400).send("Invalid email, please try again");
          } else if (!this.passwordValidation(password)) {
            this._logger.INFO("Invalid password");
            res.status(400).send("Invalid password, please try again");
          } else {
            this._logger.INFO("Failed to insert user into the request table");
            res.status(500).send("Internal server error");
          }
        } else {
          this._logger.INFO(`Successfully created signup request for user: ${email}, ${clinic}`);
          res.status(200).send("Successfully created and sent your signup request");
        }
      }).catch(() => {
        this._logger.ERROR("Error inserting user into the request table");
        res.status(400).send("Missing signup requirements, please try again");
      });
    } else {
      this._logger.INFO("Email, password, and clinic are required");
      res.status(406).send("Signup requirements not met, please fill in the required fields");
    }
  };

  public async execute(req: Request): Promise<boolean> {
    const clinic: string = req.body.clinic;
    const email: string = req.body.email;
    const dateCreated: Date = new Date();

    const rawPassword: string = req.body.password;
    const hashedPassword: string = this.hashPassword(rawPassword); 

    const user: UserRequest = new UserRequest(0, email, clinic, hashedPassword, RequestStatusEnum.AWAITING, dateCreated, RequestTypeEnum.SIGNUP, null);
    return this._userRequestService.create(user);
  };

  public validation(...args: any[]): boolean {
    const request: Request = args[0];

    return !nullOrUndefined(request.body) && 
    !nullOrUndefined(request.body.email && request.body.password && request.body.clinic) && 
    (request.body.email !== "" && request.body.passed !== "" && request.body.clinic !== "");
  };

  private emailValidation(email: string): boolean {
    const pattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
  }

  private passwordValidation(password: string): boolean {
    const pattern: RegExp = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
    return pattern.test(password);
  }

  private hashPassword(password: string): string {
    const saltRounds: number = 10;
    return bcrypt.hashSync(password, saltRounds);
  }
}
