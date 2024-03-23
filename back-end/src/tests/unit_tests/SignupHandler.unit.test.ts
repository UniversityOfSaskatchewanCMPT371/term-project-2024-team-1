/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/consistent-type-assertions */
/* eslint-disable @typescript-eslint/indent */
import "reflect-metadata";
import { Request, Response } from "express";
import { MockUserRequestRepository } from "@tests/mocked_repository/MockUserRequestRepository";
import { IUserRequestRepository } from "@app/domain/interfaces/repositories/IUserRequestRepository";
import { container } from "tsyringe";
import { SignUpHandler } from "@app/adapter/Controllers/Handlers/SignUpHandler";
import { loggerToken, userReqRepoToken } from "@app/adapter/DependencyInjections";
import { UserRequest } from "@app/domain/UserRequest";
import { flushPromises } from "../common_test_code/util_test";
import { UserRequestService } from "@app/application/UserRequestService";
import { ILogger } from "@app/domain/interfaces/ILogger";
import { Log4jsLogger } from "@app/adapter/Loggers/Log4jsLogger";
import { RequestTypeEnum } from "@app/domain/RequestTypeEnum";
import { RequestStatusEnum } from "@app/domain/RequestStatusEnum";

describe("LoginAuthHandler", () => {
    const mockUserRepo: IUserRequestRepository = new MockUserRequestRepository();
    container.register<IUserRequestRepository>(userReqRepoToken, { useValue: mockUserRepo });
    container.register<ILogger>(loggerToken, { useClass: Log4jsLogger });
    
    const handler: SignUpHandler = container.resolve(SignUpHandler);

    const dateCreated: Date = new Date(2024, 1, 1);
    const mockPass: UserRequest = new UserRequest(0, "john.doe@example.ca", "Pass", "ThisShould1@Work", RequestStatusEnum.AWAITING, dateCreated, RequestTypeEnum.SIGNUP, null);
    const mockFail: UserRequest = new UserRequest(0, "john.doeexampleca", "Fail", "ThisShdNTWork", RequestStatusEnum.AWAITING, dateCreated, RequestTypeEnum.SIGNUP, null);

    
    
    beforeEach(() => {
        jest.restoreAllMocks();
    });

    describe("handle", () => {
        
    it("should fail with 406 if validation fails", () => {
        // Setup
        const req: Request = { } as Request;
        const res: Response = { status: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as Response;
        jest.spyOn(handler, "validation").mockReturnValue(false);
        
        // Action
        handler.handle(req, res);
  
        // Assert
        expect(res.status).toHaveBeenCalledWith(406);
        expect(res.send).toHaveBeenCalledWith("Signup requirements not met");
  
      });
    });
    
    it("should create the user signup request with status 200 if the user inputs a valid email and password", async() => {
        // Setup 
        const req: Request = { body: { email: mockPass.email, password: mockPass.password, clinic: mockPass.clinicName } } as any as Request;
        const res: Response = { status: jest.fn().mockReturnThis(), send: jest.fn(), json: jest.fn() } as unknown as Response;
        jest.spyOn(handler, "validation").mockReturnValue(true);
        jest.spyOn(handler, "execute").mockResolvedValue(true);
        
         // Action
        handler.handle(req, res);
        await flushPromises();

        // Assert
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith("Sign up request success!");
    });

    it("should fail to create the user signup request with status 400 if signup requirements are not met", async() => {
        // Setup 
        const req: Request = { body: { email: mockFail.email, password: mockFail.password, clinic: mockFail.clinicName } } as any as Request;
        const res: Response = { status: jest.fn().mockReturnThis(), send: jest.fn(), json: jest.fn() } as unknown as Response;
        jest.spyOn(handler, "validation").mockReturnValue(true);
        jest.spyOn(handler, "execute").mockResolvedValue(false);
        
        // Action
        handler.handle(req, res);
        await flushPromises();

        // Assert
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith(`Failed to send signup request for user: [${mockFail.email}, ${mockFail.clinicName}], signup request not executed`);
    });

    it("Should fail with status 500 if there was an internal server error", async() => { 
        // Setup 
        const req: Request = { body: { email: mockFail.email, password: mockFail.password, clinic: mockFail.clinicName } } as any as Request;
        const res: Response = { status: jest.fn().mockReturnThis(), send: jest.fn(), json: jest.fn() } as unknown as Response;
        jest.spyOn(handler, "validation").mockReturnValue(true);
        jest.spyOn(handler, "execute").mockRejectedValue(false);
        
        // Action
        handler.handle(req, res);
        await flushPromises();

        // Assert
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith("Server failed to process request, please try again");
    });

    describe("validation", () => {
        it("should return true if user email, password, and clinic name is provided", () => {
            // Setup
            const req: Request = { body: { email: mockPass.email, password: mockPass.password, clinic: mockPass.clinicName } } as any as Request;
      
            // Action
            const result: boolean = handler.validation(req);
      
            // Assert
            expect(result).toBeTruthy();
        });

        it("should return false if user email is provided, but password and clinic is null", () => {
            // Setup
            const req: Request = { body: { email: mockPass.email, password: null, clinic: null } } as any as Request;
      
            // Action
            const result: boolean = handler.validation(req);
      
            // Assert
            expect(result).toBeFalsy();
        });

        it("should return false if user password is provided, but email and clinic is null", () => {
            // Setup
            const req: Request = { body: { email: null, password: mockPass.password, clinic: null } } as any as Request;
      
            // Action
            const result: boolean = handler.validation(req);
      
            // Assert
            expect(result).toBeFalsy();
        });

        it("should return false if user clinic is provided, but password and email is null", () => {
            // Setup
            const req: Request = { body: { email: null, password: null, clinic: mockPass.clinicName } } as any as Request;
      
            // Action
            const result: boolean = handler.validation(req);
      
            // Assert
            expect(result).toBeFalsy();
        });

        it("should return false if user email is provided, but password and clinic is undefined", () => {
            // Setup
            const req: Request = { body: { email: mockPass.email, password: undefined, clinic: undefined } } as any as Request;
      
            // Action
            const result: boolean = handler.validation(req);
      
            // Assert
            expect(result).toBeFalsy();
        });

        it("should return false if user password is provided, but email and clinic is undefined", () => {
            // Setup
            const req: Request = { body: { email: undefined, password: mockPass.password, clinic: undefined } } as any as Request;
      
            // Action
            const result: boolean = handler.validation(req);
      
            // Assert
            expect(result).toBeFalsy();
        });

        it("should return false if user clinic is provided, but password and email is undefined", () => {
            // Setup
            const req: Request = { body: { email: undefined, password: undefined, clinic: mockPass.clinicName } } as any as Request;
      
            // Action
            const result: boolean = handler.validation(req);
      
            // Assert
            expect(result).toBeFalsy();
        });
        
        it("should return false if user email, password, and clinic are null", () => {
            // Setup
            const req: Request = { body: { email: null, password: null, clinic: null } } as any as Request;
      
            // Action
            const result: boolean = handler.validation(req);
      
            // Assert
            expect(result).toBeFalsy();
        });

        it("should return false if both email, password, and clinic are undefined", () => {
            // Setup
            const req: Request = { body: { email: undefined, password: undefined, clinic: undefined } } as any as Request;
      
            // Action
            const result: boolean = handler.validation(req);
      
            // Assert
            expect(result).toBeFalsy();
        });

        // it("should return false if body is null;", () => {
        //     // Setup
        //     const req: Request = { body: null } as any as Request;
      
        //     // Action
        //     const result: boolean = handler.validation(req);
      
        //     // Assert
        //     expect(result).toBeFalsy();
        // });

        // it("should return false if body is undefined;", () => {
        //     // Setup
        //     const req: Request = { body: undefined } as any as Request;
      
        //     // Action
        //     const result: boolean = handler.validation(req);
      
        //     // Assert
        //     expect(result).toBeFalsy();
        // });
    });

    describe("execute", () => {
        it("should return true if a user signup request has been successfully been created", async () => {
            // Setup
            const req: Request = { body: { email: mockPass.email, password: mockPass.password, clinic: mockPass.clinicName } } as any as Request;
            jest.spyOn(UserRequestService.prototype, "create").mockResolvedValue(true);
      
            // Action and Assert
            await expect(handler.execute(req)).resolves.toEqual(true);
          });

          it("should return false if the user signup request has failed", async () => {
            // Setup
            const req: Request = { body: { email: mockFail.email, password: mockFail.password, clinic: mockFail.clinicName } } as any as Request;
            jest.spyOn(UserRequestService.prototype, "create").mockResolvedValue(false);
      
            // Action and Assert
            await expect(handler.execute(req)).resolves.toEqual(false);
          });
    });

});
