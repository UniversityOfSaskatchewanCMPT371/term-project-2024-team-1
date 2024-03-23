/* eslint-disable */
import "reflect-metadata";
import { Request, Response } from "express";
import { SurveyAddHandler } from "@app/adapter/Controllers/Handlers/SurveyAddHandler";
import { container } from "tsyringe";
import { MockSurveyRepository } from "../mocked_repository/MockSurveyRepository"; // Adjust path as necessary
import { ISurveyRepository } from "@app/domain/interfaces/repositories/ISurveyRepository";
import { SurveyService } from "@app/application/SurveyService";
import { Survey } from "@app/domain/Survey";

// Mock the logger to avoid console logs during tests
jest.mock("@app/adapter/Loggers/Log4jsLogger", () => ({
  getLogger: () => ({
    info: jest.fn(),
    error: jest.fn(),
  }),
}));

describe("SurveyAddHandler Tests", () => {
  let surveyAddHandler: SurveyAddHandler;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    // Setup DI container to use mock repository
    const mockSurveyRepository = new MockSurveyRepository();
    container.registerInstance<ISurveyRepository>("ISurveyRepository", mockSurveyRepository);
    container.register(SurveyService, { useClass: SurveyService });

    // Resolve SurveyAddHandler to ensure dependencies are injected
    surveyAddHandler = container.resolve(SurveyAddHandler);

    // Setup mock request and response objects
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
  });

  afterEach(() => {
    container.clearInstances(); // Ensure the container is reset after each test
  });

  it("should successfully add a survey and return 500", async () => {
    const surveyName = "Test Survey";
    mockRequest.body = { surveyName };

    await surveyAddHandler.handle(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.send).toHaveBeenCalledWith(expect.any(String));
  });

  it("should return 500 if an error occurs during survey addition", async () => {
    mockRequest.body = { surveyName: "Error Survey" };
    const mockSurveyRepository = container.resolve<ISurveyRepository>("ISurveyRepository");
    jest.spyOn(mockSurveyRepository, 'createSurvey').mockRejectedValue(new Error("Internal server error"));

    await surveyAddHandler.handle(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.send).toHaveBeenCalledWith("Error occurred while adding sample survey.");
  });
});
