import { inject, injectable } from "tsyringe";
import { IUserRepository } from "../domain/interfaces/repositories/IUserRepository";

@injectable()
export class TestService {
  constructor(@inject("User") private readonly _user: IUserRepository) {
  }

  public call(): void {
    void this._user.getAll();
  }

  
}
