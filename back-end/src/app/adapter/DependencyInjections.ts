import "reflect-metadata";
import { IUserRepository } from "@app/domain/interfaces/repositories/IUserRepository";
import { Lifecycle, container } from "tsyringe";
import { UserSQLRepository } from "./SQLRepositories/User/UserSQLRepository";
import { ILogger } from "@app/domain/interfaces/ILogger";
import { Log4jsLogger } from "./Loggers/Log4jsLogger";

export const userRepoToken: string = "UserRepo";
export const loggerToken: string = "Logger";



export function registerAllDependencies(): void {
  container.register<IUserRepository>(userRepoToken, { useClass: UserSQLRepository }, { lifecycle: Lifecycle.Singleton });
  container.register<ILogger>(loggerToken, { useClass: Log4jsLogger });
  console.log("Registered all dependencies");
}
