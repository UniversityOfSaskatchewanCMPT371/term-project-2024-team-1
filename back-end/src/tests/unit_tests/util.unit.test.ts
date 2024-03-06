/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { ADMIN, USER, authenticate, nullOrUndefined, randomAlphanumString } from "@app/application/util";
import { IUserRepository } from "@app/domain/interfaces/repositories/IUserRepository";
import { Request, Response, NextFunction } from "express";
import { container } from "tsyringe";
import { MockUserRepository } from "./mocked_repository/MockUserRepository";
import jwt from "jsonwebtoken";
import { flushPromises } from "./common_test_code/util_test";
import { User } from "@app/domain/User";

describe("util functions test", () => {
  describe("authenticate", () => {
    const mockUserRepo: IUserRepository = new MockUserRepository();

    container.register<IUserRepository>("UserRepo", { useValue: mockUserRepo });


    beforeEach(() => {
      jest.resetAllMocks();
    });

    it("should fail with 401 if there is no Authorization header", () => {
      // Setup
      const req: Request = { headers: {} } as Request;
      const res: Response = { status: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as Response;
      const next: NextFunction = jest.fn() as unknown as NextFunction;

      // Action
      authenticate("admin")(req, res, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledWith("No authorization found, please log in!");
      expect(next).not.toHaveBeenCalled();
    });

    it("should fail with 401 if there are no values in the Authorization header", () => {
      // Setup
      const req: Request = { headers: { authorization: "" } } as Request;
      const res: Response = { status: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as Response;
      const next: NextFunction = jest.fn() as unknown as NextFunction;


      // Action
      authenticate("admin")(req, res, next);
      
      // Assert
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledWith("No authorization token found, please login!");
      expect(next).not.toHaveBeenCalled();
    });

    it("should fail with 401 if the auth token is not prefixed with 'Bearer'", () => {
      // Setup
      const req: Request = { headers: { authorization: "ABC 123" } } as Request;
      const res: Response = { status: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as Response;
      const next: NextFunction = jest.fn() as unknown as NextFunction;


      // Action
      authenticate("admin")(req, res, next);
      
      // Assert
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledWith("No authorization token found, please login!");
      expect(next).not.toHaveBeenCalled();
    });

    it("should fail with 404 if userId is not found", async () => {
      // Setup
      const req: Request = { headers: { authorization: "Bearer 123" } } as Request;
      const res: Response = { status: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as Response;
      const next: NextFunction = jest.fn() as unknown as NextFunction;
      jest.spyOn(jwt, "verify").mockImplementation(() => {
        return { userId: "FakeUserId" };
      });
      jest.spyOn(mockUserRepo, "getById").mockResolvedValue(undefined);
      

      // Action
      authenticate("admin")(req, res, next);
      await flushPromises();
      
      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith("UserID not found");
      expect(next).not.toHaveBeenCalled();
    });

    it("should call next() no matter what role is permitted if user is admin", async () => {
      // Setup
      const userId: string = "RealUserId";
      const email: string = "admin@email.com";
      const req: Request = { headers: { authorization: "Bearer 123" } } as Request;
      const res: Response = { status: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as Response;
      const next: NextFunction = jest.fn() as unknown as NextFunction;
      jest.spyOn(jwt, "verify").mockImplementation(() => {
        return { userId };
      });
      jest.spyOn(mockUserRepo, "getById").mockResolvedValue(new User(userId, email, true));
      

      // Action
      authenticate("RANDOM NON EXISTANT ROLE")(req, res, next);
      await flushPromises();
      
      // Assert
      expect(next).toHaveBeenCalled();
    });

    it("should call next() if role is USER and the user permission level is admin", async () => {
      // Setup
      const userId: string = "RealUserId";
      const email: string = "admin@email.com";
      const authRole: string = USER;
      const req: Request = { headers: { authorization: "Bearer 123" } } as Request;
      const res: Response = { status: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as Response;
      const next: NextFunction = jest.fn() as unknown as NextFunction;
      jest.spyOn(jwt, "verify").mockImplementation(() => {
        return { userId };
      });
      jest.spyOn(mockUserRepo, "getById").mockResolvedValue(new User(userId, email, true));
      

      // Action
      authenticate(authRole)(req, res, next);
      await flushPromises();
      
      // Assert
      expect(next).toHaveBeenCalled();
    });

    it("should call next() if role is USER and the user permission level is user", async () => {
      // Setup
      const userId: string = "RealUserId";
      const email: string = "admin@email.com";
      const authRole: string = USER;
      const isAdmin: boolean = false;
      const req: Request = { headers: { authorization: "Bearer 123" } } as Request;
      const res: Response = { status: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as Response;
      const next: NextFunction = jest.fn() as unknown as NextFunction;
      jest.spyOn(jwt, "verify").mockImplementation(() => {
        return { userId };
      });
      jest.spyOn(mockUserRepo, "getById").mockResolvedValue(new User(userId, email, isAdmin));
      

      // Action
      authenticate(authRole)(req, res, next);
      await flushPromises();
      
      // Assert
      expect(next).toHaveBeenCalled();
    });

    it("should fail with 403 if role is ADMIN and user permission level is user", async () => {
      // Setup
      const userId: string = "RealUserId";
      const email: string = "admin@email.com";
      const authRole: string = ADMIN;
      const isAdmin: boolean = false;
      const req: Request = { headers: { authorization: "Bearer 123" } } as Request;
      const res: Response = { status: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as Response;
      const next: NextFunction = jest.fn() as unknown as NextFunction;
      jest.spyOn(jwt, "verify").mockImplementation(() => {
        return { userId };
      });
      jest.spyOn(mockUserRepo, "getById").mockResolvedValue(new User(userId, email, isAdmin));
      

      // Action
      authenticate(authRole)(req, res, next);
      await flushPromises();
      
      // Assert
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.send).toHaveBeenCalledWith("Unauthorized access, you do not have permissions!");
      expect(next).not.toHaveBeenCalled();
    });

    it("should fail with 500 if getting user from db fails", async () => {
      // Setup
      const userId: string = "RealUserId";
      const authRole: string = ADMIN;
      const req: Request = { headers: { authorization: "Bearer 123" } } as Request;
      const res: Response = { status: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as Response;
      const next: NextFunction = jest.fn() as unknown as NextFunction;
      jest.spyOn(jwt, "verify").mockImplementation(() => {
        return { userId };
      });
      jest.spyOn(mockUserRepo, "getById").mockRejectedValue("db error");
      

      // Action
      authenticate(authRole)(req, res, next);
      await flushPromises();
      
      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("Server error, please try again");
      expect(next).not.toHaveBeenCalled();
    });

    it("should fail with 401 if auth token is not a valid auth token", () => {
      // Setup
      const authRole: string = ADMIN;
      const req: Request = { headers: { authorization: "Bearer 123" } } as Request;
      const res: Response = { status: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as Response;
      const next: NextFunction = jest.fn() as unknown as NextFunction;
      jest.spyOn(jwt, "verify").mockImplementation(() => {
        throw new Error("Failed to decode auth token");
      });
      // jest.spyOn(mockUserRepo, "getById").mockRejectedValue("db error");
      

      // Action
      authenticate(authRole)(req, res, next);
      
      // Assert
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledWith("Invalid authorization, please log in!");
      expect(next).not.toHaveBeenCalled();
    });

    it("should fail with 401 if the first element of token string is not 'Bearer'", () => {
      // Setup
      const authRole: string = ADMIN;
      const req: Request = { headers: { authorization: "ABC 123" } } as Request;
      const res: Response = { status: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as Response;
      const next: NextFunction = jest.fn() as unknown as NextFunction;
      jest.spyOn(jwt, "verify").mockImplementation(() => {
        throw new Error("Failed to decode auth token");
      });
      // jest.spyOn(mockUserRepo, "getById").mockRejectedValue("db error");
      

      // Action
      authenticate(authRole)(req, res, next);
      
      // Assert
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledWith("No authorization token found, please login!");
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("nullOrUndefined", () => {
    it("should return true if object is null", () => {
      // Setup
      const obj: any = null;

      // Action
      const result: boolean = nullOrUndefined(obj);

      // Assert
      expect(result).toBeTruthy();
    });

    it("should return true if object is undefined", () => {
      // Setup
      const obj: any = undefined;

      // Action
      const result: boolean = nullOrUndefined(obj);

      // Assert
      expect(result).toBeTruthy();
    });

    it("should return false if object is not null and not undefined", () => {
      // Setup
      const obj: string = "abc 123";

      // Action
      const result: boolean = nullOrUndefined(obj);

      // Assert
      expect(result).toBeFalsy();
    });
  });

  fdescribe("randomAlphanumString", () => {
    it("should generate random string of specified length", () => {
      // Setup
      const length: number = 10;
  
      // Action
      const result: string = randomAlphanumString(length);
      // Assert
      expect(result.length).toEqual(length);
    });

    it("should generate a random string that is alphanumeric only", () => {
      // Setup
      const length: number = 10;
      const regex: RegExp = /^[a-zA-Z0-9]+$/;
      
      // Action
      const result: string = randomAlphanumString(length);
      
      // Assert
      expect(regex.test(result)).toBeTruthy();
    });
  });
});
