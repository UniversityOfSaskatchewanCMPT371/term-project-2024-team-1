/* eslint-disable @typescript-eslint/naming-convention */
import { UserRequestService } from "@app/application/UserRequestService";
import { UserService } from "@app/application/UserService";
import { UserRequest } from "@app/domain/UserRequest";
import { nullOrUndefined, randomAlphanumString } from "@app/application/util";
import { IRouteHandler } from "@app/domain/interfaces/IRouteHandler";
import { Request, Response } from "express";
import { container, injectable } from "tsyringe";
import { configure, getLogger } from "log4js";
import log4jsConfig from "@resources/log4js-config.json";
import assert from "assert";
import { RequestTypeEnum } from "@app/domain/RequestTypeEnum";
import { RequestStatusEnum } from "@app/domain/RequestStatusEnum";
import { User } from "@app/domain/User";

configure(log4jsConfig);

@injectable()
export class CreateUserHandler implements IRouteHandler<UserRequest | null> {
    
  private readonly _logger = getLogger(CreateUserHandler.name);
  private readonly USERID_LENGTH: number = 8; 
  constructor(private readonly _userRequestService: UserRequestService, private readonly _userService: UserService) {
    this._userRequestService = container.resolve(UserRequestService);
    this._userService = container.resolve(UserService);
  }

    
  public handle(req: Request, res: Response): void {
    if (this.validation(req)) { 
      this._logger.info("validation of the req body successful");
      this.execute(req).then((userRequest: UserRequest | null) => {
        if (userRequest) {
          this._logger.info("user request fetched successfully");
          assert(!nullOrUndefined(userRequest.requestType), "user request type is expected to not be null");
          if (userRequest.requestType === RequestTypeEnum.SIGNUP) {
            assert(nullOrUndefined(userRequest.decisionDate), "decision date field is expected to be null");
            assert(!nullOrUndefined(userRequest.status) && userRequest.status === RequestStatusEnum.AWAITING, "request status is expected to be AWAITING");
            userRequest.status = req.body.approved ? RequestStatusEnum.APPROVED : RequestStatusEnum.REJECTED;   
            this.update_req_execute(userRequest).then(() => {
              if (userRequest.status === RequestStatusEnum.APPROVED) {
                this._logger.info("user request status updated to approved");
                assert(userRequest.clinicName && userRequest.email && userRequest.password);
                const userId: string = randomAlphanumString(this.USERID_LENGTH);
                assert(userId.length === 8, "userId must be eight characters long");
                const newUser: User = new User(userRequest.clinicName, userId, userRequest.email, false, userRequest.password);
                this.create_user_execute(newUser).then(() => {
                  this._logger.info("user added successfully");
                  res.status(200).send("User successfully approved and created");
                }).catch((error: any) => {
                  this._logger.error("unable to add the user ", error);
                  res.status(500).send("Unable to create the user. Please try again later");
                });
              } else { 
                this._logger.warn("user not approved");
                res.status(403).send("Forbidden! User request has not been approved");
              }
            }).catch((error: any) => {
              this._logger.error("unable to update the request", error);
              res.status(500).send("Unable to update the request. Try again");
            });
          } else {
            this._logger.warn("Bad request: The request does not meet the required criteria");
            res.status(400).send("Bad request: The request does not meet the required criteria");
          }
        } else {
          this._logger.error("unable to fetch the request was found");
          res.status(404).send("Unable to retrieve the request! Try again");
        }
      }).catch((error: any) => {
        this._logger.error("error executing request retrieval:", error);
        res.status(404).send("Unable to retrieve the request! Try again");
      });
    } else {
      this._logger.warn("Validation of the request body failed. Request does not meet the required criteria");
      res.status(400).send("Bad request: The request does not meet the required criteria");   
    }
    
  }

  public async execute(req: Request): Promise<UserRequest | null> {
    const requestId: number = Number(req.body.requestId); 
    const userRequest: Promise<UserRequest | null> = this._userRequestService.get(requestId); 
    return userRequest;
  }

  public async update_req_execute(userRequest: UserRequest): Promise<boolean> { 
    userRequest.decisionDate = new Date();
    const success: boolean = await this._userRequestService.update(userRequest);
    console.log("success: ", success)
    return success;
  }

  public async create_user_execute(user: User): Promise<boolean> {
    const success: boolean = await this._userService.create(user);
    return success;
  }


  public validation(...args: any[]): boolean {
    const request: Request = args[0];
    return (
      !nullOrUndefined(request.body) && 
    !nullOrUndefined(request.body.approved) && 
    !nullOrUndefined(request.body.requestId) &&
    (typeof request.body.approved === "boolean" || request.body.approved === "true" || request.body.approved === "false") &&
    !isNaN(Number(request.body.requestId))
    ); 
  };

}
