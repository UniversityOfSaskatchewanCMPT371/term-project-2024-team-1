/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { SurveyUpdateAnswerHandler } from "@app/adapter/Controllers/Handlers/SurveyUpdateAnswerHandler";
import { loggerToken, surveyAnswerRepoToken, surveyQuestionRepoToken } from "@app/adapter/DependencyInjections";
import { Log4jsLogger } from "@app/adapter/Loggers/Log4jsLogger";
import { ILogger } from "@app/domain/interfaces/ILogger";
import { container, Lifecycle } from "tsyringe";
import { Request, Response } from "express";
import { AuthenticatedRequest, randomAlphanumString } from "@app/application/util";
import { ISurveyAnswerRepository } from "@app/domain/interfaces/repositories/ISurveyAnswerRepository";
import { SurveyAnswerService } from "@app/application/SurveyAnswerService";
import { AnswerSQLRepository } from "@app/adapter/SQLRepositories/Survey/AnswerSQLRepository";
import { SurveyAnswer } from "@app/domain/SurveyAnswer";

describe("SurveyUpdateAnswerHandler", () => {
  container.register<ILogger>(loggerToken, { useClass: Log4jsLogger });
  container.register<ISurveyAnswerRepository>(surveyAnswerRepoToken, { useClass: AnswerSQLRepository }, { lifecycle: Lifecycle.Singleton });
  container.register(SurveyAnswerService, { useClass: SurveyAnswerService });
  
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


  it("should fail with 400 if surveyId isn't provided", async () => {
    delete req.params.surveyId; // Simulate missing surveyId
    const handler: SurveyUpdateAnswerHandler = container.resolve(SurveyUpdateAnswerHandler);

    await handler.handle(req as Request, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith(expect.any(String));
  });

  it("should successfully update dirty answers", async () => {
    req.body = { dirtyAnswers: [new SurveyAnswer(randomAlphanumString(5), 1, "Yes", 1)] };
    const mockUpdate = jest.fn().mockResolvedValue(true);
    container.register(SurveyAnswerService, { useValue: { update: mockUpdate } });
    const handler: SurveyUpdateAnswerHandler = container.resolve(SurveyUpdateAnswerHandler);

    await handler.handle(req as Request, res);

    expect(mockUpdate).toHaveBeenCalledWith(req.body.dirtyAnswers);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(expect.stringContaining("dirty answers updated successfully"));
  });

  it("should respond with 200 and a message when no dirty answers are provided", async () => {
    req.body = { dirtyAnswers: [] };
    const handler: SurveyUpdateAnswerHandler = container.resolve(SurveyUpdateAnswerHandler);

    await handler.handle(req as Request, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith("No answers to update");
  });

  it("should respond with 500 if the update operation fails", async () => {
    req.body = { dirtyAnswers: [new SurveyAnswer(randomAlphanumString(5), 1, "Yes", 1)] };
    const mockUpdate = jest.fn().mockRejectedValue(new Error("Update failed due to server error"));
    container.register(SurveyAnswerService, {  useValue: {update: mockUpdate  }});
    const handler: SurveyUpdateAnswerHandler = container.resolve(SurveyUpdateAnswerHandler);

    await handler.handle(req as Request, res);

    expect(mockUpdate).toHaveBeenCalledWith(req.body.dirtyAnswers);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith("An error occurred while updating answers.");
  });
});
