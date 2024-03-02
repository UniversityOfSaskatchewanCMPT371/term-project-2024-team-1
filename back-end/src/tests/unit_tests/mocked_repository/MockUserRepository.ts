import { User } from "@app/domain/User";
import { IUserRepository } from "@app/domain/interfaces/repositories/IUserRepository";

export class MockUserRepository implements IUserRepository {
  async getAll(): Promise<User[]> {
    return Promise.resolve([]);
  }

  async getById(userId: string): Promise<User | undefined> {
    return Promise.resolve(new User(userId, "abc123", 15, false));
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
