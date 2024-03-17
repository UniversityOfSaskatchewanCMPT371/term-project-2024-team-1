import { RequestStatusEnum } from "@app/domain/RequestStatusEnum";
import { RequestTypeEnum } from "@app/domain/RequestTypeEnum";
import { UserRequest } from "@app/domain/UserRequest";
import { IUserRequestRepository } from "@app/domain/interfaces/repositories/IUserRequestRepository";

export class MockUserRequestRepository implements IUserRequestRepository {
  async getAll (requestType?: RequestTypeEnum | undefined, requestStatus?: RequestStatusEnum | undefined): Promise<UserRequest[]> {
    return Promise.resolve([]);
  }

  async get (requestId: number): Promise<UserRequest | null> {
    return Promise.resolve(new UserRequest(1, "user1@gmail.com", "clinic1", "password1", RequestStatusEnum.AWAITING, new Date(), RequestTypeEnum.SIGNUP, null));
  }

  async create (request: UserRequest): Promise<boolean> {
    return Promise.resolve(true);
  }

  async update (request: UserRequest): Promise<boolean> {
    return Promise.resolve(true);
  }

  async delete (requestId: number): Promise<boolean> {
    return Promise.resolve(true);
  };
    
}
