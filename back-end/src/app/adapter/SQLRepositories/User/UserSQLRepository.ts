import { query } from "@app/adapter/SQLRepositories/SQLConfiguration";
import { User } from "@app/domain/User";
import "reflect-metadata";
import { getLogger } from "log4js";
import { IUserRepository } from "@app/domain/interfaces/repositories/IUserRepository";
import { ResultSetHeader } from "mysql2";


export class UserSQLRepository implements IUserRepository {

  private readonly _logger = getLogger(UserSQLRepository.name);

  private readonly _getAllQuery: string = "SELECT clinicName, userId, email, isAdmin, password FROM user";
  private readonly _getQuery: string = "SELECT clinicName, userId, email, isAdmin, password FROM User WHERE userId = ? OR email = ?";
  private readonly _createQuery: string = "INSERT INTO user (clinicName, userId, password, email, isAdmin) VALUES (?, ?, ?, ?, ?)";
  private readonly _updateQuery: string = "UPDATE user SET clinicName = ?, userId = ?, password = ?, email = ?, isAdmin = ?, WHERE userId = ?";
  private readonly _deleteQuery: string = "DELETE FROM user WHERE userId = ?";

  async getAll(): Promise<User[]> {
    try {
      return query(this._getAllQuery).then((data: [User[]]) => {
        return data[0];
      });
    } catch (error) {
      this._logger.error(error);
      return Promise.reject(error);
    }
  }

  async get(userIdEmail: string): Promise<User | null> {
    try {
      return query(this._getQuery, [userIdEmail, userIdEmail]).then((data: [User[]]) => {
        if (data[0].length === 0) {
          return null;
        }
        return new User(data[0][0].clinicName, data[0][0].userId, data[0][0].email, data[0][0].isAdmin, data[0][0].password);
      });
    } catch (error) {
      this._logger.error(error);
      return Promise.reject(error);
    }
  }

  async create(user: User): Promise<boolean> {
    try {
      const isUserCreated: Promise<boolean> = query(this._createQuery,
        [user.clinicName, user.userId, user.password, user.email, user.isAdmin.toString()]);
      return isUserCreated;
    } catch (error) {
      this._logger.error(error);
      return Promise.reject(error);
    }
  }

  async update(user: User): Promise<boolean> {
    try {
      const updateUser: Promise<boolean> = query(this._updateQuery,
        [user.clinicName, user.userId, user.password, user.email, user.isAdmin.toString()]);
      return updateUser;
    } catch (error) {
      this._logger.error(error);
      return Promise.reject(error);
    }
  }

  async delete(userId: string): Promise<boolean> {
    try {
      return query(this._deleteQuery, [userId])
        .then((fieldResults: ResultSetHeader[]) => {
          const fieldResult: ResultSetHeader = fieldResults[0];
          return fieldResult.affectedRows > 0;
        })
        .catch(err => {
          throw err;
        });
    } catch (error) {
      this._logger.error(error);
      return Promise.reject(error);
    }
  }

  
}
