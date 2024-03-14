import { RequestStatusEnum } from "@app/domain/RequestStatusEnum";
import { RequestTypeEnum } from "@app/domain/RequestTypeEnum";
import { UserRequest } from "@app/domain/UserRequest";
import { IUserRequestRepository } from "@app/domain/interfaces/repositories/IUserRequestRepository";
import { query } from "../SQLConfiguration";

export class UserRequestSQLRepository implements IUserRequestRepository {
  private readonly _getAllQuery: string = `SELECT id, email, password, clinicName, status, createdDate, decisionDate, requestType 
                                           FROM Request 
                                           WHERE requestType = ? OR requestStatus = ?;`;
  private readonly _getQuery: string = `SELECT id, email, password, clinicName, status, createdDate, decisionDate, requestType 
                                        FROM Request
                                        WHERE email = ?;`;
  private readonly _create: string = `INSERT INTO Request (email, password, clinicName, status, createdDate, requestType) VALUES (?, ?, ?, ?, ?, ?);`;
  private readonly _delete: string = `DELETE FROM Request WHERE id = ?;`;


  public async getAll(requestType?: RequestTypeEnum | undefined, requestStatus?: RequestStatusEnum | undefined): Promise<UserRequest[]> {
    try {
      const requestTypeString: string | null = requestType?.toString() ?? "NULL";
      const requestStatusString: string | null = requestStatus?.toString() ?? "NULL";
      return query(this._getAllQuery, [requestTypeString, requestStatusString])
        .then((data: [UserRequest[]]) => {
          return data[0];
        });
    } catch (error) {
      return Promise.reject(error);
    }
  }


  public async get(email: string): Promise<UserRequest | null> {
    try {
      
    } catch (error) {

    }
  }

  public async create(request: UserRequest): Promise<boolean> {

  }

  public async update(request: UserRequest): Promise<boolean> {

  }

  public async delete(requestId: number): Promise<boolean> {

  }
}
