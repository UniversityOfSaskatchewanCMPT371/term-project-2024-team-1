import { RequestDTO } from "@app/adapter/DTOs/RequestDTO";
import { UserRequestService } from "@app/application/UserRequestService";
import { nullOrUndefined } from "@app/application/util";
import { LoggerFactory } from "@app/domain/factory/LoggerFactory";
import { ILogger } from "@app/domain/interfaces/ILogger";
import { IRouteHandler } from "@app/domain/interfaces/IRouteHandler";
import { RequestStatusEnum, requestStatusValueToKey } from "@app/domain/RequestStatusEnum";
import { RequestTypeEnum, requestTypeValueToKey } from "@app/domain/RequestTypeEnum";
import { UserRequest } from "@app/domain/UserRequest";
import { Request, Response } from "express";
import { injectable } from "tsyringe";

@injectable()
export class RequestGetAllHandler implements IRouteHandler<RequestDTO[]> {
  private readonly _logger: ILogger = LoggerFactory.getLogger(RequestGetAllHandler.name);

  public constructor(private readonly _userRequestService: UserRequestService) { }

  public handle(req: Request, res: Response): void {
    if (!this.validation(req, res)) {
      return;
    }
    const requestTypeRaw: string = req.query.requestType as string;
    const requestStatusRaw: string = req.query.requestStatus as string;
    const requestType: RequestTypeEnum | undefined = requestTypeValueToKey.get(requestTypeRaw);
    const requestStatus: RequestStatusEnum | undefined = requestStatusValueToKey.get(requestStatusRaw);
    
    this.execute(req)
      .then((requests: RequestDTO[]) => {
        this._logger.INFO(`Successfully fetched all ${requestStatus ?? ""} ${requestType ?? ""} requests.`);
        res.status(200).send(requests);
      })
      .catch(err => {
        this._logger.ERROR(`Failed to fetch all ${requestStatus ?? ""} ${requestType ?? ""} requests.\n Error: ${err}`);
        res.status(500).send(`Server failed to fetch all ${requestStatus ?? ""} ${requestType ?? ""} requests.`);
      });
  }

  public async execute(req: Request): Promise<RequestDTO[]> {
    const requestType: RequestTypeEnum = req.query.requestType as RequestTypeEnum;
    const requestStatus: RequestStatusEnum = req.query.requestStatus as RequestStatusEnum;
    const requests: UserRequest[] = await this._userRequestService.getAll(requestType, requestStatus);
    return requests.map((req: UserRequest) => new RequestDTO(req.id, req.email, req.clinicName, req.status, req.requestType, req.createdDate, req.decisionDate));
  };

  public validation(...args: any[]): boolean {
    const req: Request = args[0];
    const res: Response = args[1];
    
    if (!nullOrUndefined(req.query.requestType)) {
      const requestTypeRaw: string = req.query.requestType as string;
      const requestType: RequestTypeEnum | undefined = requestTypeValueToKey.get(requestTypeRaw);
      if (nullOrUndefined(requestType)) {
        res.status(400).send(`You provided an incorrect request type '${requestTypeRaw}'`);
        return false;
      }
    }

    if (!nullOrUndefined(req.query.requestStatus)) {
      const requestStatusRaw: string = req.query.requestStatus as string;
      const requestStatus: RequestStatusEnum | undefined = requestStatusValueToKey.get(requestStatusRaw);
      if (nullOrUndefined(requestStatus)) {
        res.status(400).send(`You provided an incorrect request status '${requestStatusRaw}'`);
        return false;
      }
    }
    return true;
  };
}
