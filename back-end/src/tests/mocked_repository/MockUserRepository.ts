import { User } from "@app/domain/User";
import { IUserRepository } from "@app/domain/interfaces/repositories/IUserRepository";

export class MockUserRepository implements IUserRepository {
  private readonly _fakeDb: Map<string, User>; 

  public constructor() {
    this._fakeDb = new Map();
  }

  async getAll(): Promise<User[]> {
    return Promise.resolve([...this._fakeDb.values()]);
  }

  async get(userIdEmail: string): Promise<User | null> {
    const user: User | undefined = this._fakeDb.get(userIdEmail);
    if (user === undefined) {
      return Promise.resolve(null);
    } else {
      return Promise.resolve(user);
    }
  }

  async create(user: User): Promise<boolean> {
    this._fakeDb.set(user.userId, user);
    this._fakeDb.set(user.email, user);
    return Promise.resolve(true);
  }

  async update(user: User): Promise<boolean> {
    return Promise.resolve(true);
  }

  async delete(userId: string): Promise<boolean> {
    return Promise.resolve(this._fakeDb.delete(userId));
  }
}
