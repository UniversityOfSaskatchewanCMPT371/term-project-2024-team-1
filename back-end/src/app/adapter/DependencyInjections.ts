/* eslint-disable @typescript-eslint/typedef */
import "reflect-metadata";
import { IUserRepository } from "@app/domain/interfaces/repositories/IUserRepository";
import { Lifecycle, container } from "tsyringe";
import { UserSQLRepository } from "./SQLRepositories/User/UserSQLRepository";
import { ILogger } from "@app/domain/interfaces/ILogger";
import { Log4jsLogger } from "./Loggers/Log4jsLogger";
import { ISurveyRepository } from "@app/domain/interfaces/repositories/ISurveyRepository";
import { SurveySQLRepository } from "./SQLRepositories/Survey/SurveySQLRespository";
import { IUserRequestRepository } from "@app/domain/interfaces/repositories/IUserRequestRepository";
import { UserRequestSQLRepository } from "./SQLRepositories/UserRequest/UserRequestSQLRepository";
import { ISurveyQuestionRepository } from "@app/domain/interfaces/repositories/ISurveyQuestionRepository";
import { QuestionSQLRepository } from "./SQLRepositories/Survey/QuestionSQLRepository";
import { AnswerSQLRepository } from "./SQLRepositories/Survey/AnswerSQLRepository";
import { ISurveyAnswerRepository } from "@app/domain/interfaces/repositories/ISurveyAnswerRepository";
import { ISurveyResponseByUserRepository } from "@app/domain/interfaces/repositories/ISurveyResponseByUserRepository";
import { SurveyResponseByUserSQLRepository } from "./SQLRepositories/Survey/SurveyResponseByUserSQLRepository";

export const userRepoToken = UserSQLRepository;
export const userReqRepoToken = UserRequestSQLRepository;
export const surveyRepoToken = SurveySQLRepository;
export const surveyQuestionRepoToken = QuestionSQLRepository;

export const loggerToken: string = "Logger";

export function registerAllDependencies(): void {
  container.register<IUserRepository>(userRepoToken, { useClass: userRepoToken }, { lifecycle: Lifecycle.Singleton });
  container.register<ISurveyRepository>(surveyRepoToken, { useClass: SurveySQLRepository }, { lifecycle: Lifecycle.Singleton });
  container.register<ISurveyQuestionRepository>(surveyQuestionRepoToken, { useClass: QuestionSQLRepository }, { lifecycle: Lifecycle.Singleton });
  container.register<IUserRequestRepository>(userReqRepoToken, { useClass: userReqRepoToken }, { lifecycle: Lifecycle.Singleton });


  container.register<ILogger>(loggerToken, { useClass: Log4jsLogger });
  console.log("Registered all dependencies");
}
