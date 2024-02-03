import { inject, injectable } from "tsyringe";
import { IUser } from "../domain/interfaces/repositories/IUserRepository";

@injectable()
export class TestService {
  constructor(@inject("User") private readonly _user: IUser) {
  }

  public call(): void {
    this._user.getAll();
  }
}
