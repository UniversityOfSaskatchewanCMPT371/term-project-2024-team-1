
import { User } from "@app/domain/User";

export interface IUserRepository {
  getAll: () => Promise<User[]>;
  getById: (userId: string) => Promise<User>;
  create: (user: User) => Promise<boolean>;
  update: (user: User) => Promise<boolean>;
  delete: (userId: string) => Promise<boolean>;
}
