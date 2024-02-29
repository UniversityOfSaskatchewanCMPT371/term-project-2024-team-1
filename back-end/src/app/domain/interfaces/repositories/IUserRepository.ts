
import { User } from "@app/domain/User";

export interface IUserRepository {
  getAll: () => Promise<User[]>;
  getById: (id: number) => Promise<User>;
  create: (user: User) => Promise<boolean>;
  update: (user: User) => Promise<boolean>;
  delete: (id: number) => Promise<boolean>;
}
