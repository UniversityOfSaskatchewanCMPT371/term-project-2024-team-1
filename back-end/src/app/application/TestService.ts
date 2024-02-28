import { inject, injectable } from "tsyringe";
import { IUser } from "../domain/interfaces/repositories/IUserRepository";
import { userToken } from "@app/adapter/DependencyInjections";

@injectable()
export class TestService {
  constructor(@inject(userToken) private readonly _user: IUser) {
  }

  public call(): void {
    this._user.getAll();
  }
}
