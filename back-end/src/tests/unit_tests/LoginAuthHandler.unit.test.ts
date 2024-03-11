/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/consistent-type-assertions */
/* eslint-disable @typescript-eslint/indent */
import "reflect-metadata";
import { Request, Response } from "express";
import { MockUserRepository } from "./mocked_repository/MockUserRepository";
import { IUserRepository } from "@app/domain/interfaces/repositories/IUserRepository";
import { container } from "tsyringe";
import { LoginAuthHandler } from "@app/adapter/Controllers/Handlers/LoginAuthHandler";
import { userRepoToken } from "@app/adapter/DependencyInjections";
import { User } from "@app/domain/User";
import { flushPromises } from "./common_test_code/util_test";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserService } from "@app/application/UserService";


describe("LoginAuthHandler", () => {
    const mockUserRepo: IUserRepository = new MockUserRepository();
    container.register<IUserRepository>(userRepoToken, { useValue: mockUserRepo });
    const handler: LoginAuthHandler = container.resolve(LoginAuthHandler);

    const mockUser: User = new User(
        "test12345",
        "abc123", 
        false, 
        "password1"
    );
    
    const mockAdmin: User = new User(
        "admin12345",
        "def123", 
        true, 
        "admin1"
    );
    
    
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
        expect(res.send).toHaveBeenCalledWith("UserId and Password are required");
  
      });
    });

    it("should return the access token, userId and the role as USER with status code 200 if the USER credentials are correct", async() => { 
        // Setup 
        const req: Request = { body: { userId: mockUser.userId, password: mockUser.password } } as any as Request;
        const res: Response = { status: jest.fn().mockReturnThis(), send: jest.fn(), json: jest.fn() } as unknown as Response;
        jest.spyOn(handler, "validation").mockReturnValue(true);
        jest.spyOn(handler, "execute").mockResolvedValue(mockUser);
        jest.spyOn(bcrypt, "compare").mockImplementation(async () => {
            return Promise.resolve(true);
        });
        
        jest.spyOn(jwt, "sign").mockImplementation(() => {
            return "jwttoken1";
        });
         // Action
        handler.handle(req, res);
        await flushPromises();

        // Assert
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ userId: "test12345", role: "USER", accessToken: "jwttoken1" });
    });

    it("should return the access token, userId and the role as ADMIN with status code 200 if the ADMIN credentials are correct", async() => { 
        // Setup 
        const req: Request = { body: { userId: mockAdmin.userId, password: mockAdmin.password } } as any as Request;
        const res: Response = { status: jest.fn().mockReturnThis(), send: jest.fn(), json: jest.fn() } as unknown as Response;
        jest.spyOn(handler, "validation").mockReturnValue(true);
        jest.spyOn(handler, "execute").mockResolvedValue(mockAdmin);
        jest.spyOn(bcrypt, "compare").mockImplementation(async () => {
            return Promise.resolve(true);
        });
        jest.spyOn(mockUserRepo, "getById").mockResolvedValue(mockAdmin);
        jest.spyOn(jwt, "sign").mockImplementation(() => {
            return "jwttoken1";
        });
         // Action
        handler.handle(req, res);
        await flushPromises();

        // Assert
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ userId: "admin12345", role: "ADMIN", accessToken: "jwttoken1" });
    });

    it("should fail with status code 404 if execute returned undefined", async() => { 
        // Setup 
        const req: Request = { body: { userId: mockUser.userId, password: mockUser.password } } as any as Request;
        const res: Response = { status: jest.fn().mockReturnThis(), send: jest.fn(), json: jest.fn() } as unknown as Response;
        jest.spyOn(handler, "validation").mockReturnValue(true);
        jest.spyOn(handler, "execute").mockResolvedValue(undefined);
        jest.spyOn(bcrypt, "compare").mockImplementation(async () => {
            return Promise.resolve(true);
        });
        jest.spyOn(jwt, "sign").mockImplementation(() => {
            return "jwttoken1";
        });
         // Action
        handler.handle(req, res);
        await flushPromises();

        // Assert
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith("Incorrect userId or password");
    });

    it("should fail with status code 403 if password is not matched", async() => { 
        // Setup 
        const req: Request = { body: { userId: mockUser.userId, password: mockUser.password } } as any as Request;
        const res: Response = { status: jest.fn().mockReturnThis(), send: jest.fn(), json: jest.fn() } as unknown as Response;
        jest.spyOn(handler, "validation").mockReturnValue(true);
        jest.spyOn(handler, "execute").mockResolvedValue(mockUser);
        jest.spyOn(bcrypt, "compare").mockImplementation(async () => {
            return Promise.resolve(false);
        });
        jest.spyOn(jwt, "sign").mockImplementation(() => {
            return "jwttoken1";
        });
         // Action
        handler.handle(req, res);
        await flushPromises();

        // Assert
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.send).toHaveBeenCalledWith("Incorrect userId or password");
    });

    it("should fail with status code 500 if bcrypt.compare fails", async() => { 
        // Setup 
        const req: Request = { body: { userId: mockUser.userId, password: mockUser.password } } as any as Request;
        const res: Response = { status: jest.fn().mockReturnThis(), send: jest.fn(), json: jest.fn() } as unknown as Response;
        jest.spyOn(handler, "validation").mockReturnValue(true);
        jest.spyOn(handler, "execute").mockResolvedValue(mockUser);
        jest.spyOn(bcrypt, "compare").mockImplementation(async () => {
            return Promise.reject(new Error("Error"));
        });
        jest.spyOn(jwt, "sign").mockImplementation(() => {
            return "jwttoken1";
        });
         // Action
        handler.handle(req, res);
        await flushPromises();

        // Assert
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith("Internal server error");
    });

    it("should fail with status code 404 if error occurs during getting user info", async() => { 
        // Setup 
        const req: Request = { body: { userId: mockUser.userId, password: mockUser.password } } as any as Request;
        const res: Response = { status: jest.fn().mockReturnThis(), send: jest.fn(), json: jest.fn() } as unknown as Response;
        jest.spyOn(handler, "validation").mockReturnValue(true);
        jest.spyOn(handler, "execute").mockRejectedValue("db error");
        jest.spyOn(bcrypt, "compare").mockImplementation(async () => {
            return Promise.resolve(false);
        });
        jest.spyOn(jwt, "sign").mockImplementation(() => {
            return "jwttoken1";
        });
         // Action
        handler.handle(req, res);
        await flushPromises();

        // Assert
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith("Incorrect userId or password");
    });

    describe("validation", () => {
        it("should return true if userId and password is provided", () => {
            // Setup
            const req: Request = { body: { userId: mockUser.userId, password: mockUser.password } } as any as Request;
      
            // Action
            const result: boolean = handler.validation(req);
      
            // Assert
            expect(result).toBeTruthy();
        });
        
        it("should return false if userId is provided, but password is null", () => {
            // Setup
            const req: Request = { body: { userId: mockUser.userId, password: null } } as any as Request;
      
            // Action
            const result: boolean = handler.validation(req);
      
            // Assert
            expect(result).toBeFalsy();
        });

        it("should return false if userId is provided, but password is undefined", () => {
            // Setup
            const req: Request = { body: { userId: mockUser.userId, password: undefined } } as any as Request;
      
            // Action
            const result: boolean = handler.validation(req);
      
            // Assert
            expect(result).toBeFalsy();
        });

        it("should return false if password is provided, but userId is null", () => {
            // Setup
            const req: Request = { body: { userId: null, password: mockUser.password } } as any as Request;
      
            // Action
            const result: boolean = handler.validation(req);
      
            // Assert
            expect(result).toBeFalsy();
        });

        it("should return false if password is provided, but userId is undefined", () => {
            // Setup
            const req: Request = { body: { userId: undefined, password: mockUser.password } } as any as Request;
      
            // Action
            const result: boolean = handler.validation(req);
      
            // Assert
            expect(result).toBeFalsy();
        });
        
        it("should return false if both password and userId are null", () => {
            // Setup
            const req: Request = { body: { userId: null, password: null } } as any as Request;
      
            // Action
            const result: boolean = handler.validation(req);
      
            // Assert
            expect(result).toBeFalsy();
        });

        it("should return false if both password and userId are undefined", () => {
            // Setup
            const req: Request = { body: { userId: undefined, password: undefined } } as any as Request;
      
            // Action
            const result: boolean = handler.validation(req);
      
            // Assert
            expect(result).toBeFalsy();
        });

        it("should return false if body is null;", () => {
            // Setup
            const req: Request = { body: null } as any as Request;
      
            // Action
            const result: boolean = handler.validation(req);
      
            // Assert
            expect(result).toBeFalsy();
        });

        it("should return false if body is undefined;", () => {
            // Setup
            const req: Request = { body: undefined } as any as Request;
      
            // Action
            const result: boolean = handler.validation(req);
      
            // Assert
            expect(result).toBeFalsy();
        });
    });

    describe("execute", () => {
        it("should return the user if user has been successfully retrieved", async () => {
            // Setup
            const req: Request = { body: { userId: mockUser.userId } } as any as Request;
            jest.spyOn(UserService.prototype, "getById").mockResolvedValue(mockUser);
      
            // Action and Assert
            await expect(handler.execute(req)).resolves.toEqual(mockUser);
          });

          it("should return undefined if user has not been successfully retrieved", async () => {
            // Setup
            const req: Request = { body: { userId: mockUser.userId } } as any as Request;
            jest.spyOn(UserService.prototype, "getById").mockRejectedValue(undefined);
      
            // Action and Assert
            await expect(handler.execute(req)).rejects.toEqual(undefined);
          });
    });

});
