/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { SurveyUpdateAnswerHandler } from "@app/adapter/Controllers/Handlers/SurveyUpdateAnswerHandler";
import { loggerToken, surveyAnswerRepoToken } from "@app/adapter/DependencyInjections";
import { Log4jsLogger } from "@app/adapter/Loggers/Log4jsLogger";
import { ILogger } from "@app/domain/interfaces/ILogger";
import { container } from "tsyringe";
import { Request, Response } from "express";
import { AuthenticatedRequest, randomAlphanumString } from "@app/application/util";
import { ISurveyAnswerRepository } from "@app/domain/interfaces/repositories/ISurveyAnswerRepository";
import { SurveyAnswerService } from "@app/application/SurveyAnswerService";
import { MockAnswerRepository } from "../mocked_repository/MockAnswerRepository";
// import { SurveyAnswer } from "@app/domain/SurveyAnswer";

describe("SurveyUpdateAnswerHandler", () => {
  const mockAnswerRepo: ISurveyAnswerRepository = new MockAnswerRepository();
  container.register<ILogger>(loggerToken, { useClass: Log4jsLogger });
  container.register<ISurveyAnswerRepository>(surveyAnswerRepoToken, { useValue: mockAnswerRepo });
  container.register(SurveyAnswerService, { useClass: SurveyAnswerService });
  
  const handler: SurveyUpdateAnswerHandler = container.resolve(SurveyUpdateAnswerHandler);
  // const mockSurveyAnswerService = container.resolve(SurveyAnswerService);
  let req: Request;
  let res: Response;

  beforeEach(() => {
    container.clearInstances(); // Ensure a clean state
    jest.clearAllMocks();
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


  // it("should successfully update dirty answers", async () => {
  //   req.body = { dirtyAnswers: [new SurveyAnswer("user 1", 1, "Yes", 1, 1)] };

  //   await handler.handle(req, res);

  //   expect(res.status).toHaveBeenCalledWith(200);
  //   expect(res.send).toHaveBeenCalledWith(expect.stringContaining("dirty answers updated successfully"));
  // });

  // it("should respond with 200 and a message when no dirty answers are provided", async () => {
  //   req.body = { dirtyAnswers: [] };

  //   await handler.handle(req, res);

  //   expect(res.status).toHaveBeenCalledWith(200);
  //   expect(res.send).toHaveBeenCalledWith("No answers to update");
  // });

  // it("should respond with 500 if the update operation fails", async () => {
  //   mockSurveyAnswerService.update = jest.fn().mockRejectedValue(new Error("Update failed"));

  //   req.body = { dirtyAnswers: [new SurveyAnswer("user 1", 1, "Yes", 1, 1)] };

  //   await handler.handle(req, res);

  //   expect(res.status).toHaveBeenCalledWith(500);
  //   expect(res.send).toHaveBeenCalledWith("An error occurred while updating answers.");
  // });
});
