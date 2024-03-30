import { RequestStatusEnum } from "@app/domain/RequestStatusEnum";
import { RequestTypeEnum } from "@app/domain/RequestTypeEnum";
import { UserRequest } from "@app/domain/UserRequest";
import { IUserRequestRepository } from "@app/domain/interfaces/repositories/IUserRequestRepository";
import { query } from "../SQLConfiguration";
import { LoggerFactory } from "@app/domain/factory/LoggerFactory";
import { ILogger } from "@app/domain/interfaces/ILogger";
import { formatDateForSQL } from "@app/application/util";
import { ResultSetHeader } from "mysql2";

export class UserRequestSQLRepository implements IUserRequestRepository {
  private readonly _logger: ILogger = LoggerFactory.getLogger(UserRequestSQLRepository.name);
  private readonly _getAllQuery: string = `SET @reqType=?;
                                           SET @reqStatus=?;
                                            SELECT id, email, password, clinicName, status, createdDate, decisionDate, requestType 
                                            FROM Request 
                                            WHERE requestType=@reqType OR status=@reqStatus;`;

  private readonly _getQuery: string = `SELECT id, email, password, clinicName, status, createdDate, decisionDate, requestType 
                                        FROM Request
                                        WHERE id = ?;`;

  private readonly _create: string = "INSERT INTO Request (email, password, clinicName, status, createdDate, requestType) VALUES (?, ?, ?, ?, ?, ?);";
  private readonly _updateQuery: string = "UPDATE Request SET status = ?, decisionDate = ? WHERE id = ?;";
  private readonly _deleteQuery: string = "DELETE FROM Request WHERE id = ?;";


  public async getAll(requestType?: RequestTypeEnum | undefined, requestStatus?: RequestStatusEnum | undefined): Promise<UserRequest[]> {
    try {
      const requestTypeString: string | null = requestType?.toString() ?? "NULL";
      const requestStatusString: string | null = requestStatus?.toString() ?? "NULL";
      return query(this._getAllQuery, [requestTypeString, requestStatusString])
        .then((data: [UserRequest[]]) => {
          this._logger.INFO(`Fetching all ${requestType} user requests with status ${requestStatus}`);
          return data[0];
        });
    } catch (error) {
      this._logger.ERROR(`Failed to fetch user requests error: ${error as string}`);
      return Promise.reject(error);
    }
  }


  public async get(requestId: number): Promise<UserRequest | null> {
    try {
      return query(this._getQuery, [requestId.toString()])
        .then((data: [UserRequest[]]) => {
          if (data[0].length === 0) {
            this._logger.INFO(`No request found for requestId ${requestId}`);
            return null;
          }
          this._logger.INFO(`Successfully fetched requestId ${requestId}`);
          return new UserRequest(data[0][0].id, data[0][0].email, data[0][0].clinicName, 
            data[0][0].password, data[0][0].status, data[0][0].createdDate, 
            data[0][0].requestType, data[0][0].decisionDate);
        });
    } catch (error) {
      this._logger.ERROR(`Failed to fetch user request ${requestId}, ${error as string}`);
      return Promise.reject(error);
    }
  }

  public async create(request: UserRequest): Promise<boolean> {
    try {
      return query(this._create, [request.email, request.password, request.clinicName, request.status, formatDateForSQL(request.createdDate), request.requestType]);
    } catch (error) {
      this._logger.ERROR(`Failed to create request for ${request.email}, error: ${error as string}`);
      return Promise.reject(error);
    }
    // throw new Error();
  }

  public async update(request: UserRequest): Promise<boolean> {
    try {
      const updateUser: Promise<boolean> = query(this._updateQuery,
        [request.status, formatDateForSQL(new Date()), request.id.toString()]);
      return updateUser;
    } catch (error) {
      this._logger.ERROR(`Failed to update user request, error: ${error as string}`);
      return Promise.reject(error);
    }
  }

  public async delete(requestId: number): Promise<boolean> {
    try {
      return query(this._deleteQuery, [requestId.toString()])
        .then((fieldResults: ResultSetHeader[]) => {
          const fieldResult: ResultSetHeader = fieldResults[0];
          return fieldResult.affectedRows > 0;
        })
        .catch(err => {
          throw err;
        });
    } catch (error) {
      this._logger.ERROR(`Failed to delete request ${requestId} from database, error: ${error as string}`);
      return Promise.reject(error);
    }
  }
}
