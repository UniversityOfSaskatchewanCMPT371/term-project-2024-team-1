import { RequestStatusEnum } from "./RequestStatusEnum";
import { RequestTypeEnum } from "./RequestTypeEnum";

export class UserRequest {
  private readonly _id: number;
  private readonly _clinicName: string;
  private readonly _password: string;
  private _status: RequestStatusEnum;
  private readonly _createdDate: Date;
  private _decisionDate: Date | null;
  private readonly _requestType: RequestTypeEnum;

  // public constructor(id: number, clinicName: string, password: string, status: RequestStatusEnum, createdDate: Date, requestType: RequestTypeEnum, decisionDate: Date);
  public constructor(id: number, clinicName: string, password: string, status: RequestStatusEnum, createdDate: Date, requestType: RequestTypeEnum, decisionDate?: Date) {
    this._id = id;
    this._clinicName = clinicName;
    this._password = password;
    this._status = status;
    this._createdDate = createdDate;
    this._requestType = requestType;
    this._decisionDate = decisionDate ?? null;
  }

  public get id(): number {
    return this._id;
  }

  public get clinicName(): string {
    return this._clinicName;
  }

  public get password(): string {
    return this._password;
  }

  public get status(): RequestStatusEnum {
    return this._status;
  }

  public set status(newStatus: RequestStatusEnum) {
    this._status = newStatus;
  }

  public get createdDate(): Date {
    return this._createdDate;
  }

  public get decisionDate(): Date | null {
    return this._decisionDate;
  }

  public set decisionDate(newDate: Date) {
    this._decisionDate = newDate;
  }

  public get requestType(): RequestTypeEnum {
    return this._requestType;
  }
}
