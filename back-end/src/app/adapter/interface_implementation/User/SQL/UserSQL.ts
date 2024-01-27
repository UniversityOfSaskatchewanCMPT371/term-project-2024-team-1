import { IUser } from "../../../../domain/interfaces/repositories/IUserRepository";

export class UserSQL implements IUser {

  getAll(): void {
    console.log("SQL Implementation of IUser");
  }

}
