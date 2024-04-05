import { userReqRepoToken } from "@app/adapter/DependencyInjections";
import { RequestStatusEnum } from "@app/domain/RequestStatusEnum";
import { RequestTypeEnum } from "@app/domain/RequestTypeEnum";
import { UserRequest } from "@app/domain/UserRequest";
import { IUserRequestRepository } from "@app/domain/interfaces/repositories/IUserRequestRepository";
import { delay, inject, injectable } from "tsyringe";

@injectable()
export class UserRequestService {  
  constructor(@inject(delay(() => userReqRepoToken)) private readonly _userRequestRepository: IUserRequestRepository) {

  }

  public async getAll(requestType: RequestTypeEnum, requestStatus: RequestStatusEnum): Promise<UserRequest[]> {
    return this._userRequestRepository.getAll(requestType, requestStatus);
  }

  public async get(requestId: number): Promise<UserRequest | null> {
    try {
      return this._userRequestRepository.get(requestId);
    } catch (error) {
      console.error("Failed to retrieve user by email: ", error);
      throw error;
    }
  };

  public async create(user: UserRequest): Promise<boolean> {
    return this._userRequestRepository.create(user);
  };

  public async update(user: UserRequest): Promise<boolean> {
    return this._userRequestRepository.update(user);
  };

  public async delete(requestID: number): Promise<boolean> {
    return this._userRequestRepository.delete(requestID);
  };
}
