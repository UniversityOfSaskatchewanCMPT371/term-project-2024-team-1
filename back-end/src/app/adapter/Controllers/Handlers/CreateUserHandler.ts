/* eslint-disable */

import { UserRequestService } from "@app/application/UserRequestService";
import { UserService } from "@app/application/UserService";
import { nullOrUndefined, randomAlphanumString } from "@app/application/util";
import { RequestStatusEnum } from "@app/domain/RequestStatusEnum";
import { RequestTypeEnum } from "@app/domain/RequestTypeEnum";
import { User } from "@app/domain/User";
import { UserRequest } from "@app/domain/UserRequest";
import { LoggerFactory } from "@app/domain/factory/LoggerFactory";
import { ILogger } from "@app/domain/interfaces/ILogger";
import { IRouteHandler } from "@app/domain/interfaces/IRouteHandler";
import assert from "assert";
import { Request, Response } from "express";
import { configure } from "log4js";
import { injectable } from "tsyringe";


@injectable()
export class CreateUserHandler implements IRouteHandler<UserRequest | null> {
    
  private readonly _logger: ILogger = LoggerFactory.getLogger(CreateUserHandler.name);
  private readonly USERID_LENGTH: number = 8; 
  constructor(private readonly _userRequestService: UserRequestService, private readonly _userService: UserService) {
  }

    
  public handle(req: Request, res: Response): void {
    if (this.validation(req)) { 
      this._logger.INFO("validation of the req body successful");
      this.execute(req).then((userRequest: UserRequest | null) => {
        if (userRequest) {
          this._logger.INFO("user request fetched successfully");
          assert(!nullOrUndefined(userRequest.requestType), "user request type is expected to not be null");
          if (userRequest.requestType === RequestTypeEnum.SIGNUP) {
            assert(nullOrUndefined(userRequest.decisionDate), "decision date field is expected to be null");
            assert(!nullOrUndefined(userRequest.status) && userRequest.status === RequestStatusEnum.AWAITING, "request status is expected to be AWAITING");
            userRequest.status = req.body.approved ? RequestStatusEnum.APPROVED : RequestStatusEnum.REJECTED;  
            this.update_req_execute(userRequest).then((success) => {
              if (success) {
                if (userRequest.status === RequestStatusEnum.APPROVED) {
                  this._logger.INFO("user request status updated to approved");
                  assert(userRequest.clinicName && userRequest.email && userRequest.password);
                  const userId: string = randomAlphanumString(this.USERID_LENGTH);
                  assert(userId.length === this.USERID_LENGTH, "userId must be eight characters long");
                  const newUser: User = new User(userRequest.clinicName, userId, userRequest.email, false, userRequest.password);
                  this.create_user_execute(newUser).then((success) => {
                    if (success) {
                      this._logger.INFO("user added successfully");
                      res.status(201).send("User successfully approved and created");
                    } else {
                      this._logger.INFO(`Failed to add the user ${userId}`);
                      this.rollBackChanges(res, userRequest);
                    }
                  }).catch((err): void => {
                    this._logger.ERROR(`Failed to add the user ${userId}, error occured: ${err}`);
                    this.rollBackChanges(res, userRequest);
                  });
                } else { 
                  this._logger.INFO(`User request ${userRequest.id} status successfully updated`);
                  res.status(200).send(`Successfully updated user request status ${userRequest.id}`);
                }
              } else {
                this._logger.ERROR(`Failed to update the request ${userRequest.id}`);
                res.status(500).send("Server failed process request, please try again");
              }
              
            }).catch((err) => {
              this._logger.ERROR(`Failed to update the request ${userRequest.id}, error occured: ${err}`);
              res.status(500).send("Server failed process request, please try again");
            });
          } else {
            this._logger.INFO("Bad request: The request does not meet the required criteria");
            res.status(400).send("Bad request: The request does not meet the required criteria");
          }
        } else {
          this._logger.INFO(`Failed to retrieve ${req.params.requestId}, reqeust doesn't exist`);
          res.status(404).send("Request not found");
        }
      }).catch((err) => {
        this._logger.ERROR(`Failed to retrieve ${req.params.requestId}, error occured: ${err}`);
        res.status(500).send("Server failed to process request, please try again");
      });
    } else {
      this._logger.INFO("Validation of the request body failed. Request does not meet the required criteria");
      res.status(400).send("Bad request: The request does not meet the required criteria");   
    }
    
  }

  public async execute(req: Request): Promise<UserRequest | null> {
    const requestId: number = Number(req.params.requestId); 
    const userRequest: Promise<UserRequest | null> = this._userRequestService.get(requestId); 
    return userRequest;
  }

  public async update_req_execute(userRequest: UserRequest): Promise<boolean> { 
    if (userRequest.status !== RequestStatusEnum.AWAITING) {
      userRequest.decisionDate = new Date();
    }
    const success: boolean = await this._userRequestService.update(userRequest);
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
      !nullOrUndefined(request.params) &&
    !nullOrUndefined(request.body.approved) && 
    !nullOrUndefined(request.params.requestId) &&
    (typeof request.body.approved === "boolean" || request.body.approved === "true" || request.body.approved === "false") &&
    !isNaN(Number(request.params.requestId))
    ); 
  };


  private rollBackChanges(res: Response, userRequest: UserRequest): void {
    this._logger.INFO("Rolling back changes to the request status due to unsuccessful user creation.");
    userRequest.status = RequestStatusEnum.AWAITING;
    this.update_req_execute(userRequest).then((success) => {
      if (success) {
        this._logger.INFO("Rolled back changes to the request status due to unsuccessful user creation");
        res.status(500).send(`Server failed process request, please try again`);
      } else {
        this._logger.INFO(`Failed to roll back changes to the request ${userRequest.id} status due to unsuccessful user creation`);
        res.status(500).send("Server failed process request, please try again");
      }
    }).catch((err) => {
      this._logger.ERROR(`Failed to roll back changes to the request status due to unsuccessful user creation, error occured: ${err}`);
      res.status(500).send("Server failed process request, please try again");
    });
  }

}
