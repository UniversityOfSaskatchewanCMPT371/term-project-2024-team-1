import { User } from "@app/domain/User";

export interface IUserRepository {
  getAll: () => Promise<User[]>;
  get: (userIdEmail: string) => Promise<User | null>;
  create: (user: User) => Promise<boolean>;
  update: (user: User) => Promise<boolean>;
  delete: (userId: string) => Promise<boolean>;
}
