import "reflect-metadata";
import { IUserRepository } from "@app/domain/interfaces/repositories/IUserRepository";
import { Lifecycle, container } from "tsyringe";
import { UserSQLRepository } from "./SQLRepositories/User/UserSQLRepository";
import { ILogger } from "@app/domain/interfaces/ILogger";
import { Log4jsLogger } from "./Loggers/Log4jsLogger";
import { ISurveyRepository } from "@app/domain/interfaces/repositories/ISurveyRepository";
import { IUserRequestRepository } from "@app/domain/interfaces/repositories/IUserRequestRepository";
import { UserRequestSQLRepository } from "./SQLRepositories/UserRequest/UserRequestSQLRepository";
import { ISurveyQuestionRepository } from "@app/domain/interfaces/repositories/ISurveyQuestionRepository";
import { QuestionSQLRepository } from "./SQLRepositories/Survey/QuestionSQLRepository";
import { SurveySQLRepository } from "./SQLRepositories/Survey/SurveySQLRespository";

// It's good practice to use the class names directly as tokens where possible to avoid string mismatch errors.
export const userRepoToken = UserSQLRepository;
export const userReqRepoToken = UserRequestSQLRepository;
export const surveyRepoToken = SurveySQLRepository;
export const surveyQuestionRepoToken = QuestionSQLRepository;
export const loggerToken: string = "Logger";

export function registerAllDependencies(): void {
  // Fixed: Use the class itself, not a string token, for useClass.
  container.register<IUserRepository>(userRepoToken, { useClass: UserSQLRepository }, { lifecycle: Lifecycle.Singleton });
  container.register<ISurveyRepository>(surveyRepoToken, { useClass: SurveySQLRepository }, { lifecycle: Lifecycle.Singleton });
  container.register<ISurveyQuestionRepository>(surveyQuestionRepoToken, { useClass: QuestionSQLRepository }, { lifecycle: Lifecycle.Singleton });
  container.register<IUserRequestRepository>(userReqRepoToken, { useClass: UserRequestSQLRepository }, { lifecycle: Lifecycle.Singleton });

  container.register<ILogger>(loggerToken, { useClass: Log4jsLogger });
  console.log("Registered all dependencies");
}
