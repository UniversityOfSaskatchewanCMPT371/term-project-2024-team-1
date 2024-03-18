import "reflect-metadata";
import { IUserRepository } from "@app/domain/interfaces/repositories/IUserRepository";
import { Lifecycle, container } from "tsyringe";
import { UserSQLRepository } from "./SQLRepositories/User/UserSQLRepository";
import { ILogger } from "@app/domain/interfaces/ILogger";
import { Log4jsLogger } from "./Loggers/Log4jsLogger";
import { ISurveyRepository } from "@app/domain/interfaces/repositories/ISurveyRepository";
import { SurveySQLRepository } from "./SQLRepositories/Survey/SurveySQLRespository";

export const userRepoToken: string = "UserRepo";
export const surveyRepoToken: string = "SurveyRepo";
export const loggerToken: string = "Logger";

export function registerAllDependencies(): void {
  container.register<IUserRepository>(userRepoToken, { useClass: UserSQLRepository }, { lifecycle: Lifecycle.Singleton });
  container.register<ISurveyRepository>(surveyRepoToken, { useClass: SurveySQLRepository }, { lifecycle: Lifecycle.Singleton });
  container.register<ILogger>(loggerToken, { useClass: Log4jsLogger });
  console.log("Registered all dependencies");
}
