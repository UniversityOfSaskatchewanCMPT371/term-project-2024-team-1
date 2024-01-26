import { IUser } from "../../../../domain/interfaces/repositories/IUserRepository";

export class UserOther implements IUser {
    getAll() {
        console.log("Other implementation of IUser");
    }
}