/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/consistent-type-assertions */
import "reflect-metadata";
import { Request, Response } from "express";
import { ISurveyRepository } from "@app/domain/interfaces/repositories/ISurveyRepository";
import { MockSurveyRepository } from "@tests/mocked_repository/MockSurveyRepository";
import { container } from "tsyringe";
import { SurveyGetUsersSubmittedHandler } from "@app/adapter/Controllers/Handlers/SurveyGetUsersSubmittedHandler";
import { loggerToken, surveyRepoToken } from "@app/adapter/DependencyInjections";
import { flushPromises } from "@tests/common_test_code/util_test";
import { Log4jsLogger } from "@app/adapter/Loggers/Log4jsLogger";
import { ILogger } from "@app/domain/interfaces/ILogger";
import { Survey } from "@app/domain/Survey";
import { randomAlphanumString } from "@app/application/util";
import { randomInt } from "crypto";
import { SurveyService } from "@app/application/SurveyService";
import { SurveyStatusEnum } from "@app/domain/SurveyStatusEnum";
import { MockUserRepository } from "@tests/mocked_repository/MockUserRepository";
import { IUserRepository } from "@app/domain/interfaces/repositories/IUserRepository";
import { User } from "@app/domain/User";

describe("SurveyGetUsersSubmittedHandler", () => {
  const mockSurveyRepo: ISurveyRepository = new MockSurveyRepository();
  container.register<ISurveyRepository>(surveyRepoToken, { useValue: mockSurveyRepo });
  container.register<ILogger>(loggerToken, { useClass: Log4jsLogger });
  const handler: SurveyGetUsersSubmittedHandler = container.resolve(SurveyGetUsersSubmittedHandler);


  const survey1: Survey = new Survey(randomInt(1000), randomAlphanumString(8), new Date(), new Date());
  const noSubmissionSurvey: Survey = new Survey(randomInt(1000), randomAlphanumString(8), new Date(), new Date());

  const mockUserRepo: IUserRepository = new MockUserRepository();
  void mockUserRepo.create(new User("clinic1", "user1", "email1", false, "pass1")); 
  void mockUserRepo.create(new User("clinic2", "user2", "email2", false, "pass2")); 

  beforeEach(() => {
    jest.restoreAllMocks();
    // Mocking the mapping of userId to surveyId to mark completion of the survey
    void (mockSurveyRepo as MockSurveyRepository).mapSurveyUser(1, survey1.id);
    void (mockSurveyRepo as MockSurveyRepository).mapSurveyUser(2, survey1.id);
    void (mockSurveyRepo as MockSurveyRepository).mapSurveyUser(3, survey1.id);


    void flushPromises();

  });

  describe("handle", () => {
    it("should fail with 422 if validation fails", () => {
      const req: Request = { } as Request;
      const res: Response = { status: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as Response;
      jest.spyOn(handler, "validation").mockReturnValue(false);
      handler.handle(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith("SurveyId is required");
    });

    it("should succeed with status 200 and return a list of users if all the users who submitted the survey were fetched successfully", async() => {
      const req: Request = { params: { surveyId: survey1.id }, query: { type: SurveyStatusEnum.COMPLETED } } as any as Request;
      const res: Response = { status: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as Response;
      jest.spyOn(handler, "validation").mockReturnValue(true);
      jest.spyOn(handler, "execute").mockReturnValue(Promise.resolve((mockSurveyRepo as MockSurveyRepository).getUsersCompletedSurvey(survey1.id)));
      // Call the handle method
      handler.handle(req, res);
      await flushPromises();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(["1", "2", "3"]);
    });

    it("should succeed with status 200 and return empty list if no users submitted the survey", async() => {
      const req: Request = { params: { surveyId: noSubmissionSurvey.id }, query: { type: SurveyStatusEnum.COMPLETED } } as any as Request;
      const res: Response = { status: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as Response;
      jest.spyOn(handler, "validation").mockReturnValue(true);
      jest.spyOn(handler, "execute").mockReturnValue(Promise.resolve((mockSurveyRepo as MockSurveyRepository).getUsersCompletedSurvey(noSubmissionSurvey.id)));
      // Call the handle method
      handler.handle(req, res);
      await flushPromises();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith("No users have completed the survey");
    });

    it("should fail with status 500 if execute was unsuccessful", async() => {
      const req: Request = { params: { surveyId: noSubmissionSurvey.id }, query: { type: SurveyStatusEnum.COMPLETED } } as any as Request;
      const res: Response = { status: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as Response;
      jest.spyOn(handler, "validation").mockReturnValue(true);
      jest.spyOn(handler, "execute").mockReturnValue(Promise.reject("Error"));
      // Call the handle method
      handler.handle(req, res);
      await flushPromises();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("Server failed to retrieve users, please try again.");
    });

    it("should fail with status 500 if execute returns null", async() => {
      const req: Request = { params: { surveyId: noSubmissionSurvey.id }, query: { type: SurveyStatusEnum.COMPLETED } } as any as Request;
      const res: Response = { status: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as Response;
      jest.spyOn(handler, "validation").mockReturnValue(true);
      jest.spyOn(handler, "execute").mockReturnValue(Promise.resolve(null));
      // Call the handle method
      handler.handle(req, res);
      await flushPromises();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("Server failed to retrieve users, please try again.");
    });

    it("should succeed with status 200 and return a list of users who have not completed the survey", async() => {
      const req: Request = { params: { surveyId: survey1.id }, query: { type: SurveyStatusEnum.NOT_COMPLETED } } as any as Request;
      const res: Response = { status: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as Response;
      jest.spyOn(handler, "validation").mockReturnValue(true);
      jest.spyOn(handler, "execute").mockReturnValue(Promise.resolve((mockSurveyRepo as MockSurveyRepository).getUsersNotCompletedSurvey(1)));
      // Call the handle method
      handler.handle(req, res);
      await flushPromises();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(["4", "5", "6"]);
    });

    it("should succeed with status 200 and return empty list if every user has completed the survey", async() => {
      const req: Request = { params: { surveyId: survey1.id }, query: { type: SurveyStatusEnum.NOT_COMPLETED } } as any as Request;
      const res: Response = { status: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as Response;
      jest.spyOn(handler, "validation").mockReturnValue(true);
      jest.spyOn(handler, "execute").mockReturnValue(Promise.resolve([]));
      // Call the handle method
      handler.handle(req, res);
      await flushPromises();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith("All users have completed the survey");
    });

  });

  describe("execute", () => {
    it("should return the list of users who have submitted the survey", async () => {
      const req: Request = { params: { surveyId: survey1.id }, query: { type: SurveyStatusEnum.COMPLETED } } as any as Request;
      jest.spyOn(SurveyService.prototype, "getUsersCompletedSurvey").mockResolvedValue((mockSurveyRepo as MockSurveyRepository).getUsersCompletedSurvey(survey1.id));
      
      await expect(handler.execute(req)).resolves.toEqual(["1", "2", "3"]);

    });

    it("should return empty list if no user has submitted the survey", async () => {
      const req: Request = { params: { surveyId: noSubmissionSurvey.id }, query: { type: SurveyStatusEnum.COMPLETED } } as any as Request;
      jest.spyOn(SurveyService.prototype, "getUsersCompletedSurvey").mockResolvedValue((mockSurveyRepo as MockSurveyRepository).getUsersCompletedSurvey(noSubmissionSurvey.id));
      await expect(handler.execute(req)).resolves.toEqual([]);
    });
  });

  describe("validation", () => {
    it("should return true if surveyId is provided", () => {
      const req: Request = { params: { surveyId: survey1.id }, query: { type: SurveyStatusEnum.COMPLETED } } as any as Request; 
      const result: boolean = handler.validation(req);
      expect(result).toBeTruthy();
    });

    it("should return false if surveyId is null", () => {
      const req: Request = { params: { surveyId: null }, query: { type: SurveyStatusEnum.COMPLETED } } as any as Request; 
      const result: boolean = handler.validation(req);
      expect(result).toBeFalsy();
    });

    it("should return false if surveyId is undefined", () => {
      const req: Request = { params: { surveyId: undefined }, query: { type: SurveyStatusEnum.COMPLETED } } as any as Request; 
      const result: boolean = handler.validation(req);
      expect(result).toBeFalsy();
    });

    it("should return false if params is null", () => {
      const req: Request = { params: null, query: { type: SurveyStatusEnum.COMPLETED } } as any as Request; 
      const result: boolean = handler.validation(req);
      expect(result).toBeFalsy();
    });

    it("should return false if params is null", () => {
      const req: Request = { params: undefined, query: { type: SurveyStatusEnum.COMPLETED } } as any as Request; 
      const result: boolean = handler.validation(req);
      expect(result).toBeFalsy();
    });

    it("should return false if surveyId is not a number", () => {
      const req: Request = { params: { surveyId: "NotANumber" }, query: { type: SurveyStatusEnum.COMPLETED } } as any as Request; 
      const result: boolean = handler.validation(req);
      expect(result).toBeFalsy();
    });

    it("should return false if type is not provided", () => {
      const req: Request = { params: { surveyId: "123" }, query: {} } as any as Request; 
      const result: boolean = handler.validation(req);
      expect(result).toBeFalsy();
    });

    it("should return false if type is null", () => {
      const req: Request = { params: { surveyId: "123" }, query: { type: null } } as any as Request; 
      const result: boolean = handler.validation(req);
      expect(result).toBeFalsy();
    });

    it("should return false if type is undefined", () => {
      const req: Request = { params: { surveyId: "123" }, query: { type: undefined } } as any as Request; 
      const result: boolean = handler.validation(req);
      expect(result).toBeFalsy();
    });

    it("should return false if provided type is incorrect", () => {
      const req: Request = { params: { surveyId: "123" }, query: { type: "incorrectType" } } as any as Request; 
      const result: boolean = handler.validation(req);
      expect(result).toBeFalsy();
    });


  });



});
