import { IUser } from "../domain/IUser";

export class UserOther implements IUser {
    getAll() {
        console.log("Other implementation of IUser");
    }
}