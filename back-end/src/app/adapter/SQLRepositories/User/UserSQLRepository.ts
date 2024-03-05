import { query } from "@app/adapter/SQLRepositories/SQLConfiguration";
import { User } from "@app/domain/User";
import "reflect-metadata";
import { getLogger } from "log4js";
import { IUserRepository } from "@app/domain/interfaces/repositories/IUserRepository";
import { ResultSetHeader } from "mysql2";


export class UserSQLRepository implements IUserRepository {

  private readonly _logger = getLogger(UserSQLRepository.name);

  private readonly _getAllQuery: string = "SELECT username, email, isAdmin, clinic_id, password FROM user";
  private readonly _getByIdQuery: string = "SELECT username, email, isAdmin, clinic_id, password FROM user where username = ?";
  private readonly _createQuery: string = "INSERT INTO user (username, password, email, isAdmin, clinic_id) VALUES (?, ?, ?, ?, ?)";
  private readonly _updateQuery: string = "UPDATE user SET username = ?, password = ?, email = ?, isAdmin = ?, clinic_id = ? WHERE username = ?";
  private readonly _deleteQuery: string = "DELETE FROM user WHERE username = ?";

  async getAll(): Promise<User[]> {
    try {
      return query(this._getAllQuery).then((users: User[][]) => {
        return users[0];
      });
    } catch (error) {
      this._logger.error(error);
      return Promise.reject(error);
    }
  }

  async getById(userId: string): Promise<User | undefined> {
    try {
      return query(this._getByIdQuery, [userId]).then((user: User[][]) => {
        return new User(user[0][0].userID, user[0][0].email, user[0][0].clinicID, user[0][0].isAdmin, user[0][0].password);
      });
    } catch (error) {
      this._logger.error(error);
      return Promise.reject(error);
    }
  }

  async create(user: User): Promise<boolean> {
    try {
      const isUserCreated: Promise<boolean> = query(this._createQuery,
        [user.userID, user.password, user.email, user.isAdmin.toString(), user.clinicID.toString()]);
      return isUserCreated;
    } catch (error) {
      this._logger.error(error);
      return Promise.reject(error);
    }
  }

  async update(user: User): Promise<boolean> {
    try {
      const updateUser: Promise<boolean> = query(this._updateQuery,
        [user.userID, user.password, user.email, user.isAdmin.toString(), user.clinicID.toString()]);
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
