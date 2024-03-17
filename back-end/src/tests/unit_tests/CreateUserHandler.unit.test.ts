/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/consistent-type-assertions */
import "reflect-metadata";
import { Request, Response } from "express";
import { IUserRequestRepository } from "@app/domain/interfaces/repositories/IUserRequestRepository";
import { MockUserRequestRepository } from "@tests/mocked_repository/MockUserRequestRepository";
import { container } from "tsyringe";
import { CreateUserHandler } from "@app/adapter/Controllers/Handlers/CreateUserHandler";
import { loggerToken, userRepoToken, userReqRepoToken } from "@app/adapter/DependencyInjections";
import { UserRequest } from "@app/domain/UserRequest";
import { flushPromises } from "@tests/common_test_code/util_test";
import { RequestStatusEnum } from "@app/domain/RequestStatusEnum";
import { RequestTypeEnum } from "@app/domain/RequestTypeEnum";
import { IUserRepository } from "@app/domain/interfaces/repositories/IUserRepository";
import { MockUserRepository } from "@tests/mocked_repository/MockUserRepository";
import { Log4jsLogger } from "@app/adapter/Loggers/Log4jsLogger";
import { ILogger } from "@app/domain/interfaces/ILogger";

describe("CreateUser and Modify Request", () => {
  const mockUserReqRepo: IUserRequestRepository = new MockUserRequestRepository();
  const mockUserRepo: IUserRepository = new MockUserRepository();
  container.register<IUserRequestRepository>(userReqRepoToken, { useValue: mockUserReqRepo });
  container.register<IUserRepository>(userRepoToken, { useValue: mockUserRepo });
  container.register<ILogger>(loggerToken, { useClass: Log4jsLogger });
  const handler: CreateUserHandler = container.resolve(CreateUserHandler);

  const mockReq: UserRequest = new UserRequest(1, "user1@gmail.com", "clinic1", "$2a$10$jIRie1ZM8CVysp4olOIoqOviEcG.kPWQutEftr5897GD54Cr0uNcS", RequestStatusEnum.AWAITING, new Date(), RequestTypeEnum.SIGNUP, null);
  
  const mockReq_not_SIGNUP: UserRequest = new UserRequest(1, "user1@gmail.com", "clinic1", "password1", RequestStatusEnum.AWAITING, new Date(), RequestTypeEnum.PASSWORD_RESET, null);
  const mockReq_date_not_null: UserRequest = new UserRequest(1, "user1@gmail.com", "clinic1", "password1", RequestStatusEnum.AWAITING, new Date(), RequestTypeEnum.PASSWORD_RESET, new Date());
  const mockReq_rejected: UserRequest = new UserRequest(1, "user1@gmail.com", "clinic1", "password1", RequestStatusEnum.AWAITING, new Date(), RequestTypeEnum.SIGNUP, null);

  beforeEach(() => {
    jest.restoreAllMocks();
  });

  describe("handle", () => {

    it("should fail with status code 400 if the validation fails", async() => {
      const req: Request = { } as Request;
      const res: Response = { status: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as Response;
      jest.spyOn(handler, "validation").mockReturnValue(false);
            
      handler.handle(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith("Bad request: The request does not meet the required criteria");
    });

    it("should succeed with the status code 200 if the user insertion was successful", async() => {
      const req: Request = { body: { approved: true, requestId: mockReq.id } } as Request;
      const res: Response = { status: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as Response;
      jest.spyOn(handler, "validation").mockReturnValue(true);
      jest.spyOn(handler, "execute").mockReturnValue(Promise.resolve(mockReq));
      jest.spyOn(handler, "update_req_execute").mockReturnValue(Promise.resolve(true));
      jest.spyOn(handler, "create_user_execute").mockReturnValue(Promise.resolve(true));

      // Call the handle method
      handler.handle(req, res);
      await flushPromises();

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith("User successfully approved and created");

    });

    it("should fail with the status code 404 if 'execute' was not successful in fetching the user request", async() => {
      const req: Request = { body: { approved: true, requestId: mockReq.id } } as Request;
      const res: Response = { status: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as Response;
      jest.spyOn(handler, "validation").mockReturnValue(true);
      jest.spyOn(handler, "execute").mockReturnValue(Promise.resolve(null));
      jest.spyOn(handler, "update_req_execute").mockReturnValue(Promise.resolve(true));
      jest.spyOn(handler, "create_user_execute").mockReturnValue(Promise.resolve(true));

      // Call the handle method
      handler.handle(req, res);
      await flushPromises();

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith("Unable to retrieve the request! Try again");

    });

    it("should fail with the status code 400 if request type was not SIGNUP", async() => {
      const req: Request = { body: { approved: true, requestId: mockReq_not_SIGNUP.id } } as Request;
      const res: Response = { status: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as Response;
      jest.spyOn(handler, "validation").mockReturnValue(true); 
      jest.spyOn(handler, "execute").mockReturnValue(Promise.resolve(mockReq_not_SIGNUP));
      jest.spyOn(handler, "update_req_execute").mockReturnValue(Promise.resolve(true));
      jest.spyOn(handler, "create_user_execute").mockReturnValue(Promise.resolve(true));

      // Call the handle method
      handler.handle(req, res);
      await flushPromises();

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith("Bad request: The request does not meet the required criteria");

    });

    it("should fail with the status code 400 if decision date was not null", async() => {
      const req: Request = { body: { approved: true, requestId: mockReq_date_not_null.id } } as Request;
      const res: Response = { status: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as Response;
      jest.spyOn(handler, "validation").mockReturnValue(true); 
      jest.spyOn(handler, "execute").mockReturnValue(Promise.resolve(mockReq_date_not_null));
      jest.spyOn(handler, "update_req_execute").mockReturnValue(Promise.resolve(true));
      jest.spyOn(handler, "create_user_execute").mockReturnValue(Promise.resolve(true));

      // Call the handle method
      handler.handle(req, res);
      await flushPromises();

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith("Bad request: The request does not meet the required criteria");

    });

    it("should fail with the status code 500 if the request was not updated", async() => {
      const req: Request = { body: { approved: true, requestId: mockReq.id } } as Request;
      mockReq.status = RequestStatusEnum.AWAITING;
      const res: Response = { status: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as Response;
      jest.spyOn(handler, "validation").mockReturnValue(true);
      jest.spyOn(handler, "execute").mockReturnValue(Promise.resolve(mockReq));
      jest.spyOn(handler, "update_req_execute").mockReturnValue(Promise.resolve(true));
      jest.spyOn(handler, "create_user_execute").mockReturnValue(Promise.resolve(true));

      handler.handle(req, res);
      await flushPromises();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith("User successfully approved and created");
    });

    it("should fail with the status code 403 if the request was not approved", async() => {
      const req: Request = { body: { approved: false, requestId: mockReq.id } } as Request;
      const res: Response = { status: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as Response;
      jest.spyOn(handler, "validation").mockReturnValue(true);
      jest.spyOn(handler, "execute").mockReturnValue(Promise.resolve(mockReq_rejected));
      jest.spyOn(handler, "update_req_execute").mockReturnValue(Promise.resolve(true));
      jest.spyOn(handler, "create_user_execute").mockReturnValue(Promise.resolve(true));

      handler.handle(req, res);
      await flushPromises();
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.send).toHaveBeenCalledWith("Forbidden! User request has not been approved");
    });

    it("should fail with the status code 500 if the user insertion was not successful", async() => {
      const req: Request = { body: { approved: true, requestId: mockReq.id } } as Request;
      const res: Response = { status: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as Response;
      mockReq.status = RequestStatusEnum.AWAITING;
      jest.spyOn(handler, "validation").mockReturnValue(true);
      jest.spyOn(handler, "execute").mockReturnValue(Promise.resolve(mockReq));
      jest.spyOn(handler, "update_req_execute").mockReturnValue(Promise.resolve(true));
      jest.spyOn(handler, "create_user_execute").mockReturnValue(Promise.reject(false));

      handler.handle(req, res);
      await flushPromises();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("Unable to create the user. Please try again later");
    });
  });

  describe("validation", () => {
    it("should return true if true approved status and an integer requestId is provided", () => {
      const req: Request = { body: { approved: true, requestId: 12 } } as any as Request;
      const result: boolean = handler.validation(req);
      expect(result).toBeTruthy();
    });

    it("should return true if false approved status and an integer requestId is provided", () => {
      const req: Request = { body: { approved: false, requestId: 112 } } as any as Request;
      const result: boolean = handler.validation(req);
      expect(result).toBeTruthy();
    });

    it("should return false if null approved status and an integer requestId is provided", () => {
      const req: Request = { body: { approved: null, requestId: 12 } } as any as Request;
      const result: boolean = handler.validation(req);
      expect(result).toBeFalsy();
    });

    it("should return false if undefined approved status and an integer requestId is provided", () => {
      const req: Request = { body: { approved: undefined, requestId: 12 } } as any as Request;
      const result: boolean = handler.validation(req);
      expect(result).toBeFalsy();
    });

    it("should return false if boolean approved status and a non-int requestId is provided", () => {
      const req: Request = { body: { approved: false, requestId: "NaN" } } as any as Request;
      const result: boolean = handler.validation(req);
      expect(result).toBeFalsy();
    });

    it("should return false if boolean approved status and a null requestId is provided", () => {
      const req: Request = { body: { approved: false, requestId: null } } as any as Request;
      const result: boolean = handler.validation(req);
      expect(result).toBeFalsy();
    });

    it("should return false if boolean approved status and a undefined requestId is provided", () => {
      const req: Request = { body: { approved: false, requestId: undefined } } as any as Request;
      const result: boolean = handler.validation(req);
      expect(result).toBeFalsy();
    });

    it("should return false if null approved status and a null requestId is provided", () => {
      const req: Request = { body: { approved: null, requestId: null } } as any as Request;
      const result: boolean = handler.validation(req);
      expect(result).toBeFalsy();
    });

    it("should return false if undefined approved status and a undefined requestId is provided", () => {
      const req: Request = { body: { approved: undefined, requestId: undefined } } as any as Request;
      const result: boolean = handler.validation(req);
      expect(result).toBeFalsy();
    });

    it("should return false if undefined body is provided", () => {
      const req: Request = { body: undefined } as any as Request;
      const result: boolean = handler.validation(req);
      expect(result).toBeFalsy();
    });

    it("should return false if null body is provided", () => {
      const req: Request = { body: null } as any as Request;
      const result: boolean = handler.validation(req);
      expect(result).toBeFalsy();
    });
  });

});
