import { query } from "@app/adapter/SQLRepositories/SQLConfiguration";
import { User } from "@app/domain/User";
import "reflect-metadata";
import { IUserRepository } from "../../../domain/interfaces/repositories/IUserRepository";



export class UserSQL implements IUserRepository {

  async getAll(): Promise<User[]> {
    try {
      const users: Promise<User[]> = query("SELECT * FROM user");
      return users;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  }

  async getById(id: number): Promise<User | undefined> {
    try {
      const user: User | undefined = await query("SELECT * FROM user where id = ?", [String(id)]);
      return user;
    } catch (error) {
      console.error("Error fetching user by id:", error);
      throw error;
    }
  }

  async create(user: any): Promise<void> {
    try {
      await query("INSERT INTO user (userID, password, email, isAdmin, clinic_id) VALUES (?, ?, ?, ?, ?)", 
        [user.userID, user.password, user.email, user.isAdmin, user.clinic_id]);
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  async update(user: any): Promise<void> {
    try {
      await query("UPDATE user SET userID = ?, password = ?, email = ?, isAdmin = ?, clinic_id = ? WHERE id = ?", 
        [user.userID, user.password, user.email, user.isAdmin, user.clinic_id, user.id]);
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await query("DELETE FROM user WHERE id = ?", [String(id)]);
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  }

  
}
