import { IUser } from "../../../../domain/interfaces/repositories/IUserRepository";

export class UserSQL implements IUser {
    constructor() {};

    getAll() {
        console.log("SQL Implementation of IUser")
    }

}