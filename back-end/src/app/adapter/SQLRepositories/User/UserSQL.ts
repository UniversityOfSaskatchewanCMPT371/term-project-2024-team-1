import { query } from "@app/adapter/SQLRepositories/SQLConfiguration";
import { User } from "@app/domain/User";
import "reflect-metadata";
import { getLogger } from "log4js";
import { IUserRepository } from "@app/domain/interfaces/repositories/IUserRepository";


export class UserSQL implements IUserRepository {

  private readonly _logger = getLogger(UserSQL.name);

  private readonly _getAllQuery: string = "SELECT * FROM user";
  private readonly _getByIdQuery: string = "SELECT * FROM user where id = ?";
  private readonly _createQuery: string = "INSERT INTO user (userID, password, email, isAdmin, clinic_id) VALUES (?, ?, ?, ?, ?)";
  private readonly _updateQuery: string = "UPDATE user SET userID = ?, password = ?, email = ?, isAdmin = ?, clinic_id = ? WHERE id = ?";
  private readonly _deleteQuery: string = "DELETE FROM user WHERE id = ?";

  async getAll(): Promise<User[]> {
    try {
      const users: Promise<User[]> = query(this._getAllQuery);
      return users;
    } catch (error) {
      this._logger.error(error);
      return Promise.reject(error);
    }
  }

  async getById(id: number): Promise<User> {
    try {
      const user: Promise<User> = query(this._getByIdQuery, [id.toString()]);
      return user;
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

  async delete(id: number): Promise<boolean> {
    try {
      const isDeleted: Promise <boolean> = query(this._deleteQuery, [id.toString()]);
      return isDeleted;
    } catch (error) {
      this._logger.error(error);
      return Promise.reject(error);
    }
  }

}
