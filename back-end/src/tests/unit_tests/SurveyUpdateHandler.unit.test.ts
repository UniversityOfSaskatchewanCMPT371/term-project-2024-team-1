/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { SurveyUpdateAnswerHandler } from "@app/adapter/Controllers/Handlers/SurveyUpdateAnswerHandler";
import { loggerToken, surveyAnswerRepoToken, surveyQuestionRepoToken } from "@app/adapter/DependencyInjections";
import { Log4jsLogger } from "@app/adapter/Loggers/Log4jsLogger";
import { ILogger } from "@app/domain/interfaces/ILogger";
import { container, Lifecycle } from "tsyringe";
import { Request, Response } from "express";
import { AuthenticatedRequest, randomAlphanumString } from "@app/application/util";
import { randomInt } from "crypto";
import { ISurveyQuestionRepository } from "@app/domain/interfaces/repositories/ISurveyQuestionRepository";
import { QuestionSQLRepository } from "@app/adapter/SQLRepositories/Survey/QuestionSQLRepository";
import { ISurveyAnswerRepository } from "@app/domain/interfaces/repositories/ISurveyAnswerRepository";
import { SurveyQuestion } from "@app/domain/SurveyQuestion";
import { QuestionTypeEnum } from "@app/domain/QuestionTypeEnum";
import { AnswerSQLRepository } from "@app/adapter/SQLRepositories/Survey/AnswerSQLRepository";
import { SurveyAnswer } from "@app/domain/SurveyAnswer";

describe("SurveyUpdateHandler", () => {
  container.register<ILogger>(loggerToken, { useClass: Log4jsLogger });
  container.register<ISurveyQuestionRepository>(surveyQuestionRepoToken, { useClass: QuestionSQLRepository }, { lifecycle: Lifecycle.Singleton });
  container.register<ISurveyAnswerRepository>(surveyAnswerRepoToken, { useClass: surveyAnswerRepoToken }, { lifecycle: Lifecycle.Singleton });

  const handler: SurveyUpdateAnswerHandler = container.resolve(SurveyUpdateAnswerHandler);
  let req: Request;
  let res: Response;

  beforeEach(() => {
    jest.restoreAllMocks();
    req = { } as Request;
    res = { status: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as Response;
  });

  it("should fail with 400 if surveyId isn't provided", async () => {
    // Setup
    (req as AuthenticatedRequest).auth = { userId: randomAlphanumString(8) };

    // Action
    await handler.handle(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should fail with 400 when surveyId is alphabetical", async () => {
    // Setup
    (req as AuthenticatedRequest).auth = { userId: randomAlphanumString(8) };
    req.params = { surveyId: "abc" };

    // Action
    await handler.handle(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
  });


  it("should respond with 404 if survey has no questions or a non-existent survey", async () => {
    // Setup
    (req as AuthenticatedRequest).auth = { userId: randomAlphanumString(8) };
    req.params = { surveyId: randomInt(100).toString() };
    jest.spyOn(QuestionSQLRepository.prototype, "getBySurvey").mockResolvedValue([]);

    // Action
    await handler.handle(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(404);
  });


  it("should respond with 500 if getting questions database operation failed", async () => {
    // Setup
    (req as AuthenticatedRequest).auth = { userId: randomAlphanumString(8) };
    req.params = { surveyId: randomInt(100).toString() };
    jest.spyOn(QuestionSQLRepository.prototype, "getBySurvey").mockRejectedValue("db operation get by survey failed");
    jest.spyOn(AnswerSQLRepository.prototype, "getSurveyAnswers").mockResolvedValue([new SurveyAnswer(randomAlphanumString(8), 15, "Valid Answer", 15)]);

    // Action
    await handler.handle(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("should respond with 500 if getting answers database operation failed", async () => {
    // Setup
    (req as AuthenticatedRequest).auth = { userId: randomAlphanumString(8) };
    req.params = { surveyId: randomInt(100).toString() };
    jest.spyOn(QuestionSQLRepository.prototype, "getBySurvey").mockResolvedValue([new SurveyQuestion(randomInt(100), randomAlphanumString(15), true, QuestionTypeEnum.TEXT, randomInt(10))]);
    jest.spyOn(AnswerSQLRepository.prototype, "getSurveyAnswers").mockRejectedValue("db operation get answers failed");

    // Action
    await handler.handle(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("should respond with 200 if successfully retrieved survey content", async () => {
    // Setup
    (req as AuthenticatedRequest).auth = { userId: randomAlphanumString(8) };
    req.params = { surveyId: randomInt(100).toString() };
    jest.spyOn(QuestionSQLRepository.prototype, "getBySurvey").mockResolvedValue([new SurveyQuestion(randomInt(100), randomAlphanumString(15), true, QuestionTypeEnum.TEXT, randomInt(10))]);
    jest.spyOn(AnswerSQLRepository.prototype, "getSurveyAnswers").mockResolvedValue([new SurveyAnswer(randomAlphanumString(10), randomInt(5), randomAlphanumString(10), randomInt(5))]);

    // Action
    await handler.handle(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should respond with 200 if successfully retrieved survey questions with no answers", async () => {
    // Setup
    (req as AuthenticatedRequest).auth = { userId: randomAlphanumString(8) };
    req.params = { surveyId: randomInt(100).toString() };
    jest.spyOn(QuestionSQLRepository.prototype, "getBySurvey").mockResolvedValue([new SurveyQuestion(randomInt(100), randomAlphanumString(15), true, QuestionTypeEnum.TEXT, randomInt(10))]);
    jest.spyOn(AnswerSQLRepository.prototype, "getSurveyAnswers").mockResolvedValue([]);

    // Action
    await handler.handle(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should respond with 200 if successfully retrieved survey questions with answers", async () => {
    // Setup
    (req as AuthenticatedRequest).auth = { userId: randomAlphanumString(8) };
    req.params = { surveyId: randomInt(100).toString() };
    const questions: SurveyQuestion[] = [
      new SurveyQuestion(1, randomAlphanumString(10), true, QuestionTypeEnum.TEXT, 1),
      new SurveyQuestion(2, randomAlphanumString(10), true, QuestionTypeEnum.TEXT, 1)
    ];
    const answers: SurveyAnswer[] = [
      new SurveyAnswer(randomAlphanumString(5), randomInt(5), randomAlphanumString(5), 1),
      new SurveyAnswer(randomAlphanumString(5), randomInt(5), randomAlphanumString(5), 2)
    ];
    jest.spyOn(QuestionSQLRepository.prototype, "getBySurvey").mockResolvedValue(questions);
    jest.spyOn(AnswerSQLRepository.prototype, "getSurveyAnswers").mockResolvedValue(answers);

    // Attaching answers to its questions
    questions[0].answer = answers[0];
    questions[1].answer = answers[1];

    // Action
    await handler.handle(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(questions);
  });
});
