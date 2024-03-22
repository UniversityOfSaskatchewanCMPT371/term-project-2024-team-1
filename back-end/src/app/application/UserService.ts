import { userRepoToken } from "@app/adapter/DependencyInjections";
import { User } from "@app/domain/User";
import { IUserRepository } from "@app/domain/interfaces/repositories/IUserRepository";
import { inject, injectable } from "tsyringe";

@injectable()
export class UserService {
  constructor(@inject(userRepoToken) private readonly _userRepository: IUserRepository) {

  }

  public async getAll(): Promise<User[]> {
    return this._userRepository.getAll();
  };

  public async get(userIdEmail: string): Promise<User | null> {
    try {
      
      return this._userRepository.get(userIdEmail);
    } catch (error) {
      console.error("Failed to retrieve user by id: ", error);
      throw error;
    }
  };

  public async create(user: User): Promise<boolean> {
    return this._userRepository.create(user);
  };

  public async update(user: User): Promise<boolean> {
    return this._userRepository.update(user);
  };

  public async delete(userId: string): Promise<boolean> {
    return this._userRepository.delete(userId);
  };
}
