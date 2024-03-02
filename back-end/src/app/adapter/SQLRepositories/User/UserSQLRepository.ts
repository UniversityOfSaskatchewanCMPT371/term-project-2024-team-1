import { query } from "@app/adapter/SQLRepositories/SQLConfiguration";
import { User } from "@app/domain/User";
import "reflect-metadata";
import { getLogger } from "log4js";
import { IUserRepository } from "@app/domain/interfaces/repositories/IUserRepository";


export class UserSQLRepository implements IUserRepository {

  private readonly _logger = getLogger(UserSQLRepository.name);

  private readonly _getAllQuery: string = "SELECT * FROM user";
  private readonly _getByIdQuery: string = "SELECT * FROM user where username = ?";
  private readonly _createQuery: string = "INSERT INTO user (username, password, email, isAdmin, clinic_id) VALUES (?, ?, ?, ?, ?)";
  private readonly _updateQuery: string = "UPDATE user SET username = ?, password = ?, email = ?, isAdmin = ?, clinic_id = ? WHERE id = ?";
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

  async getById(userId: string): Promise<User> {
    try {
      return query(this._getByIdQuery, [userId]).then((user: User[][]) => {
        return user[0][0];
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
        [user.userID, user.password, user.email, user.isAdmin.toString(), user.clinicID.toString(), user.id.toString()]);
      return updateUser;
    } catch (error) {
      this._logger.error(error);
      return Promise.reject(error);
    }
  }

  async delete(userId: string): Promise<boolean> {
    try {
      const isDeleted: Promise <boolean> = query(this._deleteQuery, [userId]);
      return isDeleted;
    } catch (error) {
      this._logger.error(error);
      return Promise.reject(error);
    }
  }

  
}