import { container, injectable } from "tsyringe";
import { Request, Response } from "express";
import { UserRequestService } from "@app/application/UserRequestService";
import { RequestStatusEnum } from "@app/domain/RequestStatusEnum";
import { UserRequest } from "@app/domain/UserRequest";
import bcrypt from "bcrypt";
import { ILogger } from "@app/domain/interfaces/ILogger";
import { IRouteHandler } from "@app/domain/interfaces/IRouteHandler";
import { LoggerFactory } from "@app/domain/factory/LoggerFactory";
import { RequestTypeEnum } from "@app/domain/RequestTypeEnum";
import { nullOrUndefined } from "@app/application/util";

@injectable()
export class SignUpHandler implements IRouteHandler<boolean> {
  private readonly _logger: ILogger = LoggerFactory.getLogger(SignUpHandler.name);

  constructor(private readonly _userRequestService: UserRequestService) {
    this._userRequestService = container.resolve(UserRequestService);
  }

  public handle(req: Request, res: Response): void {
    if (this.validation(req)) {
      const email: string = req.body.email;
      const clinic: string = req.body.clinic;

      this.execute(req).then(success => {
        if (success) {
          this._logger.INFO(`Successfully sent signup request for user: ${email}, ${clinic}`);
          res.status(200).send("Sign up request success!");
        } else {
          this._logger.INFO(`Failed to send signup request for user: [${email}, ${clinic}], missing signup requirements`);
          res.status(400).send(`Failed to send signup request for user: [${email}, ${clinic}], signup request not executed`);
        }
      }).catch((err) => { 
        this._logger.ERROR(`Failed to send signuprequest for user: [${email}, ${clinic}], error code: ${err}`); 
        res.status(500).send("Server failed to process request, please try again"); 
      });
    } else {
      this._logger.INFO("Failed to send signup request, does not meet signup credentials");
      res.status(406).send("Signup requriemnts not met");
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
    const email: string = request.body.email;
    const password: string = request.body.password;
    const clinic: string = request.body.clinic;
    const isethics: boolean = request.body.agreedToEthics;

    return !nullOrUndefined(request.body) && 
    !nullOrUndefined(request.body.email && 
      request.body.password && request.body.clinic) && 
      (email !== "" && password !== "" && clinic !== "" && isethics) && 
      (this.emailValidation(email) && this.passwordValidation(password));
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
