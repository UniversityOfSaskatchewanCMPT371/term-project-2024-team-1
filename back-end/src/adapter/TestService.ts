import { inject, injectable } from "tsyringe";
import { IUser } from "../domain/IUser";

@injectable()
export class TestService {
    constructor(@inject("User") private user: IUser) {

    }

    public call(): void {
        this.user.getAll();
    }
}