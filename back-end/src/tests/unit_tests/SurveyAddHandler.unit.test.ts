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

  const dueDate: Date = new Date();

  const mockPass: Survey = new Survey(1, "Pass", dueDate);

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
      expect(res.send).toHaveBeenCalledWith("Incorrect survey format, please try again!");
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

    it("should fail with status code 400 if execute failed", () => {
      // Setup
      const req: Request = { body: { surveyId: mockPass.id, surveyName: mockPass.surveyName, dueDate: mockPass.dueDate } } as Request;
      const res: Response = { status: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as Response;
      jest.spyOn(handler, "validation").mockReturnValue(true);
      jest.spyOn(handler, "execute").mockResolvedValue(false);
  
      // Action
      handler.handle(req, res);
  
      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith("Failed to create survey");
    });
  
    it("should pass with status code 201 if it successfully creates a survey", () => {
      // Setup
      const req: Request = { body: { surveyId: mockPass.id, surveyName: mockPass.surveyName, dueDate: mockPass.dueDate } } as Request;
      const res: Response = { status: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as Response;
      jest.spyOn(handler, "validation").mockReturnValue(true);
      jest.spyOn(handler, "execute").mockResolvedValue(true);
  
      // Action
      handler.handle(req, res);
  
      // Assert
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith("Successfully created survey");
    });
  });

  describe("execute", () => {
    it("should return false if survey name has not been provided", () => {
      const req: Request = { body: { surveyId: mockPass.id, surveyName: mockPass.surveyName, dueDate: mockPass.dueDate } } as Request;
    });
  });
});
