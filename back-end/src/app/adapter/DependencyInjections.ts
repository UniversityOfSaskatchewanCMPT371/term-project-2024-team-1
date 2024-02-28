import { IUser } from "@app/domain/interfaces/repositories/IUserRepository";
import { Lifecycle, container } from "tsyringe";
import { UserSQL } from "./SQLRepositories/User/UserSQL";

export const userToken: string = "User";


export function registerAllDependencies(): void {
  container.register<IUser>(userToken, { useClass: UserSQL }, { lifecycle: Lifecycle.Singleton });
  console.log("Registered all dependencies");
}
