/* eslint-disable */
import "reflect-metadata";
import { container } from "tsyringe";
import { Survey } from "@app/domain/Survey";
import { Request, Response } from "express";
import { ILogger } from "@app/domain/interfaces/ILogger";
import { Log4jsLogger } from "@app/adapter/Loggers/Log4jsLogger";
import { loggerToken, surveyRepoToken } from "@app/adapter/DependencyInjections";
import { ISurveyRepository } from "@app/domain/interfaces/repositories/ISurveyRepository";
import { SurveyAddHandler } from "@app/adapter/Controllers/Handlers/SurveyAddHandler";
import { MockSurveyRepository } from "@tests/mocked_repository/MockSurveyRepository";

describe("SurveyAddHandler", () => {
  const mockSurveyRepo: ISurveyRepository = new MockSurveyRepository();
  container.register(surveyRepoToken, { useValue: mockSurveyRepo });
  container.register<ILogger>(loggerToken, { useClass: Log4jsLogger });

  const handler: SurveyAddHandler = container.resolve(SurveyAddHandler);

  const dueDate: Date = new Date(2024, 1, 1);

  const mockPass: Survey = new Survey(-1, "Pass", dueDate);

  beforeEach(() => {
    jest.restoreAllMocks();
  });

  describe("handle", () => {
    it("should fail with status code 422 if validation fails", () => {
      // Setup
      const req: Request = { } as Request;
      const res: Response = { status: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as Response;
      jest.spyOn(handler, "validation").mockReturnValue(false);

      // Action
      handler.handle(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(422);
      expect(res.send).toHaveBeenCalledWith("Incorect survey format, please try again!");
    });

    it("should fail with status code 500 if there is a server error", () => {
      // Setup
      const req: Request = { body: { surveyId: mockPass.id, surveyName: mockPass.surveyName, dueDate: mockPass.dueDate } } as Request;
      const res: Response = { status: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as Response;
      jest.spyOn(handler, "validation").mockReturnValue(true);
      jest.spyOn(handler, "execute").mockResolvedValue(false);

      // Action
      handler.handle(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("Server failed to process request, please try again");
    });
  });

  it("should fail with status code 400 if execute failed", () => {
    // Setup
    const req: Request = { body: { surveyId: mockPass.id, surveyName: mockPass.surveyName, dueDate: mockPass.dueDate } } as Request;
    const res: Response = { status: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as Response;
    jest.spyOn(handler, "validation").mockReturnValue(true);
    jest.spyOn(handler, "execute").mockResolvedValue(false);

    // Action
    handler.handle(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith("Failed to create survey");
  });

  it("should pass with status code 200 if it successfully creates a survey", () => {
    // Setup
    const req: Request = { body: { surveyId: mockPass.id, surveyName: mockPass.surveyName, dueDate: mockPass.dueDate } } as Request;
    const res: Response = { status: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as Response;
    jest.spyOn(handler, "validation").mockReturnValue(true);
    jest.spyOn(handler, "execute").mockResolvedValue(true);

    // Action
    handler.handle(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith("Successfully created survey");
  });
});

// describe("SurveyAddHandler Tests", () => {
//   beforeEach(() => {
//     container.clearInstances();
//     container.register<ISurveyRepository>(surveyRepoToken, { useClass: MockSurveyRepository });
//   });

//   const mockResponse = (): Response => {
//     const res: any = {};
//     res.status = jest.fn().mockReturnValue(res);
//     res.json = jest.fn().mockReturnValue(res);
//     res.send = jest.fn().mockReturnValue(res);
//     return res as Response;
//   };

//   it("should successfully add a survey and return 200", async () => {
//     const handler = container.resolve(SurveyAddHandler);
//     const req = { body: { surveyName: "New Survey", dateCreated: new Date() } } as Request;
//     const res = mockResponse();

//     await handler.handle(req, res);

//     expect(res.status).toHaveBeenCalledWith(200);
//     expect(res.json).toHaveBeenCalledWith({ message: "Survey added successfully." });
//   });

//   it("should return 400 if the survey data is invalid", async () => {
//     const handler = container.resolve(SurveyAddHandler);
//     const req = { body: {} } as Request; // Invalid or missing data
//     const res = mockResponse();

//     await handler.handle(req, res);

//     expect(res.status).toHaveBeenCalledWith(400);
//     expect(res.send).toHaveBeenCalled();
//   });

//   it("should return 500 if there is an error adding the survey", async () => {
//     const handler = container.resolve(SurveyAddHandler);
//     const req = { body: { surveyName: "Survey with DB issue", dateCreated: new Date() } } as Request;
//     const res = mockResponse();

//     // Simulating a database error
//     jest.spyOn(MockSurveyRepository.prototype, "createSurvey").mockImplementationOnce(async () => {
//       throw new Error("Database error");
//     });

//     await handler.handle(req, res);

//     expect(res.status).toHaveBeenCalledWith(500);
//     expect(res.send).toHaveBeenCalledWith("Internal server error");
//   });
// });
