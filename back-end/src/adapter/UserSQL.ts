import { IUser } from "../domain/IUser";

export class UserSQL implements IUser {
    constructor() {};

    getAll() {
        console.log("SQL Implementation of IUser")
    }

}