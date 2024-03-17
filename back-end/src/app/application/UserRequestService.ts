import { userReqRepoToken } from "@app/adapter/DependencyInjections";
import { RequestStatusEnum } from "@app/domain/RequestStatusEnum";
import { RequestTypeEnum } from "@app/domain/RequestTypeEnum";
import { UserRequest } from "@app/domain/UserRequest";
import { IUserRequestRepository } from "@app/domain/interfaces/repositories/IUserRequestRepository";
import { inject, injectable } from "tsyringe";

@injectable()
export class UserRequestService {
  constructor(@inject(userReqRepoToken) private readonly _userReqRepository: IUserRequestRepository) {

  }

  public async getAll(requestType?: RequestTypeEnum, requestStatus?: RequestStatusEnum): Promise<UserRequest[]> {
    return this._userReqRepository.getAll(requestType);
  }

  public async get(requestId: number): Promise<UserRequest | null> {
    try {
      return this._userReqRepository.get(requestId);
    } catch (error) {
      console.error("Failed to retrieve user by requestId: ", error);
      throw error;
    }
  };

  public async create(request: UserRequest): Promise<boolean> {
    return this._userReqRepository.create(request);
  };

  public async update(request: UserRequest): Promise<boolean> {
    return this._userReqRepository.update(request);
  };

  public async delete(requestId: number): Promise<boolean> {
    return this._userReqRepository.delete(requestId);
  };
}
