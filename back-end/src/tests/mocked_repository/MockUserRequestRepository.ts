import { RequestStatusEnum } from "@app/domain/RequestStatusEnum";
import { RequestTypeEnum } from "@app/domain/RequestTypeEnum";
import { UserRequest } from "@app/domain/UserRequest";
import { IUserRequestRepository } from "@app/domain/interfaces/repositories/IUserRequestRepository";

export class MockUserRequestRepository implements IUserRequestRepository {

  private readonly _fakeDb: Map<string, UserRequest>; 

  public constructor() {
    this._fakeDb = new Map();
  }

  async getAll (requestType?: RequestTypeEnum | undefined, requestStatus?: RequestStatusEnum | undefined): Promise<UserRequest[]> {
    return Promise.resolve([...this._fakeDb.values()]);
  }

  async get (requestId: number): Promise<UserRequest | null> {
    const reqId: string = requestId.toString();
    const userReq: UserRequest | undefined = this._fakeDb.get(reqId);
    if (userReq === undefined) {
      return Promise.resolve(null);
    } else {
      return Promise.resolve(userReq);
    }
    // return Promise.resolve(new UserRequest(1, "user1@gmail.com", "clinic1", "password1", RequestStatusEnum.AWAITING, new Date(), RequestTypeEnum.SIGNUP, null));
  }

  async create (request: UserRequest): Promise<boolean> {
    const reqId: string = request.id.toString();
    this._fakeDb.set(reqId, request);
    return Promise.resolve(true);
  }

  async update (request: UserRequest): Promise<boolean> {
    return Promise.resolve(true);
  }

  async delete (requestId: number): Promise<boolean> {
    return Promise.resolve(true);
  };
    
}
