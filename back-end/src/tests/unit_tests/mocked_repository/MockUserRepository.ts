import { User } from "@app/domain/User";
import { IUserRepository } from "@app/domain/interfaces/repositories/IUserRepository";

export class MockUserRepository implements IUserRepository {
  async getAll(): Promise<User[]> {
    return Promise.resolve([]);
  }

  async get(userIdEmail: string): Promise<User | null> {
    return Promise.resolve(new User("clinic1", "test12345", "abc123@gmail.com", false, "password1"));
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
