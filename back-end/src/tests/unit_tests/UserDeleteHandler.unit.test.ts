/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/consistent-type-assertions */
import "reflect-metadata";
import { Request, Response } from "express";
import { MockUserRepository } from "./mocked_repository/MockUserRepository";
import { IUserRepository } from "@app/domain/interfaces/repositories/IUserRepository";
import { container } from "tsyringe";
import { UserDeleteHandler } from "@app/adapter/Controllers/Handlers/UserDeleteHandler";
import { loggerToken, userRepoToken } from "@app/adapter/DependencyInjections";
import { flushPromises } from "./common_test_code/util_test";
import { UserService } from "@app/application/UserService";
import { Log4jsLogger } from "@app/adapter/Loggers/Log4jsLogger";
import { ILogger } from "@app/domain/interfaces/ILogger";

describe("UserDeleteHandler", () => {
  const mockUserRepo: IUserRepository = new MockUserRepository();
  container.register<IUserRepository>(userRepoToken, { useValue: mockUserRepo });
  container.register<ILogger>(loggerToken, { useClass: Log4jsLogger });
  
  const handler: UserDeleteHandler = container.resolve(UserDeleteHandler);

  let userId: string = "abc123";
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  describe("handle", () => {


    it("should fail with 422 if validation fails", () => {
      // Setup
      const req: Request = { } as Request;
      const res: Response = { status: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as Response;
      jest.spyOn(handler, "validation").mockReturnValue(false);
      
      // Action
      handler.handle(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(422);
      expect(res.send).toHaveBeenCalledWith("UserID is required");

    });

    it("should return success message with 200 if user is successfully deleted", async () => {
      // Setup
      const req: Request = { params: { userId } } as any as Request;
      const res: Response = { status: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as Response;
      jest.spyOn(handler, "validation").mockReturnValue(true);
      jest.spyOn(handler, "execute").mockResolvedValue(true);
      
      // Action
      handler.handle(req, res);
      await flushPromises();

      // Assert
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(`Successfully removed user ${userId}`);
    });

    it("should fail with 404 if execute returned false; it did not delete any user", async () => {
      // Setup
      const req: Request = { params: { userId } } as any as Request;
      const res: Response = { status: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as Response;
      jest.spyOn(handler, "validation").mockReturnValue(true);
      jest.spyOn(handler, "execute").mockResolvedValue(false);
      
      // Action
      handler.handle(req, res);
      await flushPromises();

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith(`User ${userId} not found, delete was not performed`);
    });

    it("should fail with 500 if an error occurs during deletion", async () => {
      // Setup
      userId = "test";
      const req: Request = { params: { userId } } as any as Request;
      const res: Response = { status: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as Response;
      jest.spyOn(handler, "validation").mockReturnValue(true);
      jest.spyOn(handler, "execute").mockRejectedValue("db error");
      
      // Action
      handler.handle(req, res);
      await flushPromises();

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("Server failed to process request, please try again");
    });
  });

  describe("validation", () => {
    it("should return true if userId is provided", () => {
      // Setup
      const req: Request = { params: { userId } } as any as Request;

      // Action
      const result: boolean = handler.validation(req);

      // Assert
      expect(result).toBeTruthy();
    });

    it("should return false if userId is null", () => {
      // Setup
      const req: Request = { params: { userId: null } } as any as Request;

      // Action
      const result: boolean = handler.validation(req);

      // Assert
      expect(result).toBeFalsy();
    });

    it("should return false if userId is undefined", () => {
      // Setup
      const req: Request = { params: { userId: undefined } } as any as Request;

      // Action
      const result: boolean = handler.validation(req);

      // Assert
      expect(result).toBeFalsy();
    });

    it("should return false if params is null", () => {
      // Setup
      const req: Request = { params: null } as any as Request;

      // Action
      const result: boolean = handler.validation(req);

      // Assert
      expect(result).toBeFalsy();
    });

    it("should return false if params is undefined", () => {
      // Setup
      const req: Request = { params: undefined } as any as Request;

      // Action
      const result: boolean = handler.validation(req);

      // Assert
      expect(result).toBeFalsy();
    });
  });

  describe("execute", () => {
    it("should return true if user has been successfully deleted", async () => {
      // Setup
      expect.assertions(1);
      const req: Request = { params: { userId } } as any as Request;
      jest.spyOn(UserService.prototype, "delete").mockResolvedValue(true);

      // Action and Assert
      await expect(handler.execute(req)).resolves.toEqual(true);
    });

    it("should return false if user has not been successfully deleted", async () => {
      // Setup
      expect.assertions(1);
      const req: Request = { params: { userId } } as any as Request;
      jest.spyOn(UserService.prototype, "delete").mockResolvedValue(false);

      // Action and Assert
      await expect(handler.execute(req)).resolves.toEqual(false);
    });
  });
});
