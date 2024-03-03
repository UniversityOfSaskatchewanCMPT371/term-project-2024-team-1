import "reflect-metadata"; 
import { UserGetAllHandler } from "@app/adapter/Controllers/Handlers/UserGetAllHandler";
import { UserService } from "@app/application/UserService";
import { User } from "@app/domain/User";
import { Request, Response } from "express";
import { container, injectable } from "tsyringe";

jest.mock("@app/application/UserService");

@injectable()
class MockUserRepository {
  async getAll(): Promise<User[]> {

    const users: User[] = [
      new User(1, "user1", "pass1", "user1@example.com", 123),
      new User(2, "user2", "pass2", "user2@example.com", 456)
    ];

    return Promise.resolve(users);
  }
}


container.register("IUserRepository", { useClass: MockUserRepository });

describe("UserGetAllHandler", () => {
  let handler: UserGetAllHandler;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    
    jest.clearAllMocks();

    
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const mockUserService: UserService = {} as UserService;

    
    mockRequest = {
      get: jest.fn()
      
    };

    
    mockResponse = {
      send: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    
    handler = new UserGetAllHandler(mockUserService);
  });

  it("should handle request and send all users", async () => {
   
    const sendSpy: any = jest.spyOn(mockResponse, "send");
  
    
    await handler.handle(mockRequest as Request, mockResponse as Response);
  
    
    expect(sendSpy).toHaveBeenCalledWith([
      // eslint-disable-next-line @typescript-eslint/naming-convention
      expect.objectContaining({ id: 1, username: "user1", password: "pass1", email: "user1@example.com", clinic_id: 123 }),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      expect.objectContaining({ id: 2, username: "user2", password: "pass2", email: "user2@example.com", clinic_id: 456 })
    ]);
  });
  
});
