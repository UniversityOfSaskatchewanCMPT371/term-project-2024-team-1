import { RequestStatusEnum } from "@app/domain/RequestStatusEnum";
import { RequestTypeEnum } from "@app/domain/RequestTypeEnum";
import { UserRequest } from "@app/domain/UserRequest";

export interface IUserRequestRepository {
  getAll: (requestType?: RequestTypeEnum, requestStatus?: RequestStatusEnum) => Promise<UserRequest[]>;
  get: (email: string) => Promise<UserRequest | null>;
  create: (request: UserRequest) => Promise<boolean>;
  update: (request: UserRequest) => Promise<boolean>;
  delete: (requestId: number) => Promise<boolean>;
}
