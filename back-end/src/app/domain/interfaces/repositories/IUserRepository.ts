
import { User } from "@app/domain/User";


console.log("User type:", User);
export interface IUserRepository {
  getAll: () => Promise<User[]>;
  getById: (id: number) => Promise<User | undefined>;
  create: (user: User) => void;
  update: (user: User) => void;
  delete: (id: number) => void;
}
