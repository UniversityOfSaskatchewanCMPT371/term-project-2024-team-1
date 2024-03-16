/* eslint-disable @typescript-eslint/typedef */
import request from "supertest";
import { app } from "../../../src/main";
import "reflect-metadata";
import { container } from "tsyringe";
import { ILogger } from "@app/domain/interfaces/ILogger";
import { loggerToken, userRepoToken, userReqRepoToken } from "@app/adapter/DependencyInjections";
import { Log4jsLogger } from "@app/adapter/Loggers/Log4jsLogger";
import { MockUserRepository } from "@tests/unit_tests/mocked_repository/MockUserRepository";
import { IUserRepository } from "@app/domain/interfaces/repositories/IUserRepository";
import { IUserRequestRepository } from "@app/domain/interfaces/repositories/IUserRequestRepository";
import { MockUserRequestRepository } from "@tests/unit_tests/mocked_repository/MockUserRequestRepository";
import { UserSQLRepository } from "@app/adapter/SQLRepositories/User/UserSQLRepository";
import { User } from "@app/domain/User";

// register dependency
const mockUserReqRepo: IUserRequestRepository = new MockUserRequestRepository();
const mockUserRepo: IUserRepository = new MockUserRepository();
container.register<ILogger>(loggerToken, { useClass: Log4jsLogger });
container.register<IUserRequestRepository>(userReqRepoToken, { useValue: mockUserReqRepo });
container.register<IUserRepository>(userRepoToken, { useValue: mockUserRepo });



describe("Login API Test /api/login", () => {
  const user1: User = new User("testClinic", "test12345", "test@gmail.com", false, "smkfomg452AM$");
  const notUser: User = new User("testClinic", "idNotExist", "test@gmail.com", false, "smkfomg452AM$");
  const wrongPasswordUser: User = new User("testClinic", "test12345", "test@gmail.com", false, "wrongpass");

  it("should fail if the userId doesn't exist", async () => {
    jest.spyOn(UserSQLRepository.prototype, "get").mockImplementation(async () => null);
    const response = await request(app).post("/api/login").send({ userIdEmail: notUser.userId, password: notUser.password });

    expect(response.statusCode).toBe(404);
    expect(response.text).toContain("Incorrect userId or password");
    expect(response.body).not.toHaveProperty("accessToken");
  });

  it("should fail if the userEmail doesn't exist", async () => {
    jest.spyOn(UserSQLRepository.prototype, "get").mockImplementation(async () => null);
    const response = await request(app).post("/api/login").send({ userIdEmail: notUser.email, password: notUser.password });
    
    expect(response.statusCode).toBe(404);
    expect(response.text).toContain("Incorrect userId or password");
    expect(response.body).not.toHaveProperty("accessToken");
  });

  it("should fail if the password is incorrect", async () => {
    jest.spyOn(UserSQLRepository.prototype, "get").mockImplementation(async () => wrongPasswordUser);
    const response = await request(app).post("/api/login").send({ userIdEmail: wrongPasswordUser.email, password: wrongPasswordUser.password });
    
    expect(response.statusCode).toBe(403);
    expect(response.text).toContain("Incorrect userId or password");
    expect(response.body).not.toHaveProperty("accessToken");
  });

  it("should return an auth token when logged in with the correct email/password", async () => {
    jest.spyOn(UserSQLRepository.prototype, "get").mockImplementation(async (userIdEmail) => mockUserRepo.get(userIdEmail));
    const response = await request(app).post("/api/login").send({ userIdEmail: user1.email, password: user1.password });
    
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("accessToken");
    expect(response.body).toHaveProperty("userId");
    expect(response.body).toHaveProperty("role");
  });

  it("should return an auth token when logged in with the correct userId/password", async () => {
    jest.spyOn(UserSQLRepository.prototype, "get").mockImplementation(async (userIdEmail) => mockUserRepo.get(userIdEmail));
    const response = await request(app).post("/api/login").send({ userIdEmail: user1.userId, password: user1.password });
    
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("accessToken");
    expect(response.body).toHaveProperty("userId");
    expect(response.body).toHaveProperty("role");
  });

});
