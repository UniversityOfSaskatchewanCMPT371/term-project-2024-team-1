/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/consistent-type-assertions */
import "reflect-metadata";
import { Request, Response } from "express";
import { ISurveyRepository } from "@app/domain/interfaces/repositories/ISurveyRepository";
import { MockSurveyRepository } from "@tests/mocked_repository/MockSurveyRepository";
import { container } from "tsyringe";
import { SurveyGetUserResponseHandler } from "@app/adapter/Controllers/Handlers/SurveyGetUserResponseHandler";
import { loggerToken, surveyRepoToken } from "@app/adapter/DependencyInjections";
import { flushPromises } from "@tests/common_test_code/util_test";
import { Log4jsLogger } from "@app/adapter/Loggers/Log4jsLogger";
import { ILogger } from "@app/domain/interfaces/ILogger";
import { Survey } from "@app/domain/Survey";
import { randomAlphanumString } from "@app/application/util";
import { randomInt } from "crypto";

describe("SurveyGetUserResponse", () => {
  const mockSurveyRepo: ISurveyRepository = new MockSurveyRepository();
  container.register<ISurveyRepository>(surveyRepoToken, { useValue: mockSurveyRepo });
  container.register<ILogger>(loggerToken, { useClass: Log4jsLogger });
  const handler: SurveyGetUserResponseHandler = container.resolve(SurveyGetUserResponseHandler);

  const survey1: Survey = new Survey(randomInt(1000), randomAlphanumString(8), new Date());
  const noSurveyResponse: Survey = new Survey(randomInt(1000), randomAlphanumString(8), new Date());

  beforeEach(() => {
    jest.restoreAllMocks();

    void (mockSurveyRepo as MockSurveyRepository).mapSurveyUser(1, survey1.surveyId);
    void (mockSurveyRepo as MockSurveyRepository).mapSurveyUser(2, survey1.surveyId);
    void (mockSurveyRepo as MockSurveyRepository).mapSurveyUser(3, survey1.surveyId);
    
    void flushPromises();
  });
  describe("handle", () => {
    it("should fail with 400 if validation fails", () => {
      const req: Request = {} as Request;
      const res: Response = { status: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as Response;
      jest.spyOn(handler, "validation").mockReturnValue(false);
      handler.handle(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith("Invalid request");
    });
      
    it("should fail with 403 if user is not admin", async () => {
      const req: Request = { params: { surveyId: "1", userId: "user1" } } as any as Request;
      const res: Response = { status: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as Response;
      // What is the method that checks if the user has admin rights?
      jest.spyOn(handler, "validation").mockReturnValue(false);
      handler.handle(req, res);
      await flushPromises();
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.send).toHaveBeenCalledWith("Forbidden: user not admin");
    });
    // How do we even return an Excel file?
    it("should succeed with status 200 and return the responses of a user if fetched successfully", async () => {
      const req: Request = { params: { surveyId: "1", userId: "user1" } } as any as Request;
      const res: Response = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
        setHeader: jest.fn()
      } as unknown as Response;
      jest.spyOn(handler, "validation").mockReturnValue(true);
      handler.handle(req, res);
      await flushPromises();
      expect(res.setHeader).toHaveBeenCalledWith("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith("ExcelContent");
    });
      
    it("should fail with status 404 if the survey or user is not found", async () => {
      const req: Request = { params: { surveyId: "2", userId: "user2" } } as any as Request;
      const res: Response = { status: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as Response;
      jest.spyOn(handler, "validation").mockReturnValue(true);
      handler.handle(req, res);
      await flushPromises();
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith("Not Found");
    });
    it("should fail with status 500 if execute was unsuccessful", async() => {
      const req: Request = { params: { surveyId: noSurveyResponse.surveyId } } as any as Request;
      const res: Response = { status: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as Response;
      jest.spyOn(handler, "validation").mockReturnValue(true);
      jest.spyOn(handler, "execute").mockReturnValue(Promise.reject("Error"));
      handler.handle(req, res);
      await flushPromises();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("Server failed to retrieve users, please try again.");
    });
      
    it("should fail with status 500 if execute returns null", async() => {
      const req: Request = { params: { surveyId: noSurveyResponse.surveyId } } as any as Request;
      const res: Response = { status: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as Response;
      jest.spyOn(handler, "validation").mockReturnValue(true);
      jest.spyOn(handler, "execute").mockReturnValue(Promise.resolve(null));
      handler.handle(req, res);
      await flushPromises();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("Server failed to retrieve users, please try again.");
    });
      
  });
  describe("execute", () => {
    it("should return all responses by a user for a survey", async () => {
      const req: Request = { params: { surveyId: survey1.surveyId, userId: "1" } } as any as Request;
      const result = await handler.execute(req);
      expect(result).toBe("ExcelContent");
    });
    it("should return null if no responses are found", async () => {
      const req: Request = { params: { surveyId: noSurveyResponse.surveyId, userId: "1" } } as any as Request;
      const result = await handler.execute(req);
      expect(result).toBeNull();
    });
  });
  describe("validation", () => {
    it("should return true if surveyId is provided", () => {
      const req: Request = { params: { surveyId: survey1.surveyId } } as any as Request; 
      const result: boolean = handler.validation(req);
      expect(result).toBeTruthy();
    });
    it("should return false if surveyId is undefined", () => {
      const req: Request = { params: { surveyId: undefined } } as any as Request; 
      const result: boolean = handler.validation(req);
      expect(result).toBeFalsy();
    });
    it("should return false if surveyId is null", () => {
      const req: Request = { params: { surveyId: null } } as any as Request; 
      const result: boolean = handler.validation(req);
      expect(result).toBeFalsy();
    });
    it("should return false if surveyId is not a number", () => {
      const req: Request = { params: { surveyId: "NotANumber" } } as any as Request; 
      const result: boolean = handler.validation(req);
      expect(result).toBeFalsy();
    });
    it("shoud return true if userId is provided", () => {
      const req: Request = { params: { surveyId: survey1.surveyId, userId: "user1" } } as any as Request; 
      const result: boolean = handler.validation(req);
      expect(result).toBeTruthy();
    });
    it("should return false if userId is undefined", () => {
      const req: Request = { params: { surveyId: survey1.surveyId, userId: undefined } } as any as Request; 
      const result: boolean = handler.validation(req);
      expect(result).toBeFalsy();
    });
    it("should return false if userId is null", () => {
      const req: Request = { params: { surveyId: survey1.surveyId, userId: null } } as any as Request; 
      const result: boolean = handler.validation(req);
      expect(result).toBeFalsy();
    });
    it("should return false if userId is not a string", () => {
      const req: Request = { params: { surveyId: survey1.surveyId, userId: 1 } } as any as Request; 
      const result: boolean = handler.validation(req);
      expect(result).toBeFalsy();
    });
    it("should return false if params is undefined", () => {
      const req: Request = { params: undefined } as any as Request; 
      const result: boolean = handler.validation(req);
      expect(result).toBeFalsy();
    });
    it("should return false if params is null", () => {
      const req: Request = { params: null } as any as Request; 
      const result: boolean = handler.validation(req);
      expect(result).toBeFalsy();
    });
      
  });
});
