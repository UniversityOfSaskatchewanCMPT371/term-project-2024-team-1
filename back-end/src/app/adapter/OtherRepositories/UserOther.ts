import { IUser } from "@app/domain/interfaces/repositories/IUserRepository";

export class UserOther implements IUser {
  getAll(): void {
    console.log("Other implementation of IUser");
  }
}
