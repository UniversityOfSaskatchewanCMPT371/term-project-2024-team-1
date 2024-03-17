import { User } from "@app/domain/User";
import { IUserRepository } from "@app/domain/interfaces/repositories/IUserRepository";

export class MockUserRepository implements IUserRepository {
  async getAll(): Promise<User[]> {
    return Promise.resolve([]);
  }

  async get(userIdEmail: string): Promise<User | null> {
    return Promise.resolve(new User("testClinic", "test12345", "test@gmail.com", true, "$2a$05$nWO8LNgCKQXnD6oWr3vUAenZB1THK56RqVzzZBCEYtXFl/K3d6KaC"));
  }

  async create(user: User): Promise<boolean> {
    return Promise.resolve(true);
  }

  async update(user: User): Promise<boolean> {
    return Promise.resolve(true);
  }

  async delete(userId: string): Promise<boolean> {
    return Promise.resolve(true);
  }
}
