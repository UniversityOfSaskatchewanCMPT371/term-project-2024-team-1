/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/consistent-type-assertions */
import "reflect-metadata";
import { Request, Response, response } from "express";
import { container } from "tsyringe";
import { loggerToken, surveyAnswerRepoToken } from "@app/adapter/DependencyInjections";
import { flushPromises } from "@tests/common_test_code/util_test";
import { Log4jsLogger } from "@app/adapter/Loggers/Log4jsLogger";
import { ILogger } from "@app/domain/interfaces/ILogger";
import { ISurveyAnswerRepository } from "@app/domain/interfaces/repositories/ISurveyAnswerRepository";
import { MockAnswerRepository } from "@tests/mocked_repository/MockAnswerRepository";
import { CreateAnswerHandler } from "@app/adapter/Controllers/Handlers/CreateAnswerHandler";
import { AuthenticatedRequest } from "@app/application/util";

describe("CreateUser and Modify Request", () => {
  const mockAnswerRepo: ISurveyAnswerRepository = new MockAnswerRepository();
  container.register<ISurveyAnswerRepository>(surveyAnswerRepoToken, { useValue: mockAnswerRepo });
  container.register<ILogger>(loggerToken, { useClass: Log4jsLogger });
  const handler: CreateAnswerHandler = container.resolve(CreateAnswerHandler);

  beforeEach(() => {
    jest.restoreAllMocks();
  });

  describe("handle", () => {

    it("should fail with status code 404 if the validation fails", async() => {
      const req: Request = { } as Request;
      const res: Response = { status: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as Response;
      jest.spyOn(handler, "validation").mockReturnValue(false);
            
      handler.handle(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith("SurveyAnswer not provided to");
    });

    it("should succeed with the status code 200 if the user insertion was successful", async() => {
      const req: Request = { body: { SurveyAnswer: {} } } as unknown as Request;
      const res: Response = { status: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as Response;
      jest.spyOn(handler, "validation").mockReturnValue(true);
      jest.spyOn(handler, "execute").mockReturnValue(Promise.resolve(1));

      // Call the handle method
      handler.handle(req, res);
      await flushPromises();

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({ answerId: 1 });

    });

    it("should fail with the status code 500 if 'execute' did not create an answer", async() => {
      const req: Request = { body: { SurveyAnswer: {} } } as unknown as Request;
      const res: Response = { status: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as Response;
      jest.spyOn(handler, "validation").mockReturnValue(true);
      jest.spyOn(handler, "execute").mockReturnValue(Promise.resolve(NaN));

      // Call the handle method
      handler.handle(req, res);
      await flushPromises();

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith(`Failed to add answer`);

    });

    it("should fail with the status code 500 if 'execute' throws an error", async() => {
      const req: Request = { body: { SurveyAnswer: {} } } as unknown as Request;
      const res: Response = { status: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as Response;
      jest.spyOn(handler, "validation").mockReturnValue(true);
      jest.spyOn(handler, "execute").mockReturnValue(Promise.reject(new Error("Error")));

      // Call the handle method
      handler.handle(req, res);
      await flushPromises();

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("Failed to add answer, server error, please try again");

    });
  });

  describe("validation", () => {
    it("should return true if request body is defined, request body contains SurveyAnswer() and SurveyAnswer.userId is same as auth.userId", () => {
      const req: Request = { body: { SurveyAnswer: { answerId: 1, questionId: 1, userId: "testUserId", answer: "testAnswer" } }, auth: { userId: "testUserId" } } as unknown as AuthenticatedRequest;
      const result: boolean = handler.validation(req, response);
      expect(result).toBeTruthy();
    });

    it("should return false if request body is null", () => {
      const req: Request = { auth: { userId: "testUserId" } } as unknown as AuthenticatedRequest;
      const result: boolean = handler.validation(req, response);
      expect(result).toBeFalsy();
    });

    it("should return false if request body has no SurveyAnswer", () => {
      const req: Request = { body: { }, auth: { userId: "testUserId" } } as unknown as AuthenticatedRequest;
      const result: boolean = handler.validation(req, response);
      expect(result).toBeFalsy();
    });

    // it("should return false if request params do not contain surveyId", () => {
    //   const req: Request = { body: { SurveyAnswer: {userId: "testUserId"} }, auth:  { userId: "testUserId" } } as unknown as AuthenticatedRequest;
    //   const result: boolean = handler.validation(req);
    //   expect(result).toBeFalsy();
    // });

    it("should return false if userId in auth does not match that of SurveyAnswer", () => {
      const req: Request = { body: { SurveyAnswer: { answerId: 1, questionId: 1, userId: "testfakeUserId", answer: "testAnswer" }, auth: { userId: "testUserId" } } } as unknown as AuthenticatedRequest;
      const result: boolean = handler.validation(req, response);
      expect(result).toBeFalsy();
    });

    it("should return false if request body's SurveyAnswer has undefined answerId field", () => {
      const req: Request = { body: { SurveyAnswer: { questionId: 1, userId: "testUserId", answer: "testAnswer" } }, auth: { userId: "testUserId" } } as unknown as AuthenticatedRequest;
      const result: boolean = handler.validation(req, response);
      expect(result).toBeFalsy();
    });

    it("should return false if request body's SurveyAnswer has negative answerId field", () => {
      const req: Request = { body: { SurveyAnswer: { answerId: -1, questionId: 1, userId: "testUserId", answer: "testAnswer" } }, auth: { userId: "testUserId" } } as unknown as AuthenticatedRequest;
      const result: boolean = handler.validation(req, response);
      expect(result).toBeFalsy();
    });

    it("should return false if request body's SurveyAnswer has undefined questionId field", () => {
      const req: Request = { body: { SurveyAnswer: { answerId: -1, userId: "testUserId", answer: "testAnswer" } }, auth: { userId: "testUserId" } } as unknown as AuthenticatedRequest;
      const result: boolean = handler.validation(req, response);
      expect(result).toBeFalsy();
    });

    it("should return false if request body's SurveyAnswer has negative questionId field", () => {
      const req: Request = { body: { SurveyAnswer: { answerId: 1, questionId: -1, userId: "testUserId", answer: "testAnswer" } }, auth: { userId: "testUserId" } } as unknown as AuthenticatedRequest;
      const result: boolean = handler.validation(req, response);
      expect(result).toBeFalsy();
    });

    it("should return false if request body's SurveyAnswer has undefined userId field", () => {
      const req: Request = { body: { SurveyAnswer: { answerId: 1, questionId: -1, answer: "testAnswer" } }, auth: { userId: "testUserId" } } as unknown as AuthenticatedRequest;
      const result: boolean = handler.validation(req, response);
      expect(result).toBeFalsy();
    });

    it("should return false if request body's SurveyAnswer has undefined answer field", () => {
      const req: Request = { body: { SurveyAnswer: { answerId: 1, questionId: 1, userId: "testUserId" } }, auth: { userId: "testUserId" } } as unknown as AuthenticatedRequest;
      const result: boolean = handler.validation(req, response);
      expect(result).toBeFalsy();
    });
  });

});
