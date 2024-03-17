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
import { UserRequest } from "@app/domain/UserRequest";
import { RequestStatusEnum } from "@app/domain/RequestStatusEnum";
import { RequestTypeEnum } from "@app/domain/RequestTypeEnum";
import { UserRequestSQLRepository } from "@app/adapter/SQLRepositories/UserRequest/UserRequestSQLRepository";

// register dependency
const mockUserReqRepo: IUserRequestRepository = new MockUserRequestRepository();
const mockUserRepo: IUserRepository = new MockUserRepository();
container.register<ILogger>(loggerToken, { useClass: Log4jsLogger });
container.register<IUserRequestRepository>(userReqRepoToken, { useValue: mockUserReqRepo });
container.register<IUserRepository>(userRepoToken, { useValue: mockUserRepo });

const USER_TOKEN: string = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0MTIzNDUiLCJpYXQiOjE3MTA2Mzc5MTJ9.YSpO-XXbZdGZrZb7-MANJB1KKNwPOq5LTwwqrlAP5pY"

describe("Create User API Test /api/signup", () => {
  const userReq: UserRequest = new UserRequest(1, "user1@gmail.com", "clinic1", "password1", RequestStatusEnum.AWAITING, new Date(), RequestTypeEnum.SIGNUP, null)
  const notSignupUserReq = new UserRequest(1, "user1@gmail.com", "clinic1", "password1", RequestStatusEnum.AWAITING, new Date(), RequestTypeEnum.PASSWORD_RESET, null)
  const decisionMadeUserReq = new UserRequest(1, "user1@gmail.com", "clinic1", "password1", RequestStatusEnum.APPROVED, new Date(), RequestTypeEnum.PASSWORD_RESET, new Date());  

  it("should successfully create the user if the request was approved", async () => {
    jest.spyOn(UserRequestSQLRepository.prototype, "get").mockImplementation(async (requestId) => mockUserReqRepo.get(requestId));
    jest.spyOn(UserRequestSQLRepository.prototype, "update").mockImplementation(async (userReq) => mockUserReqRepo.update(userReq))
    jest.spyOn(UserSQLRepository.prototype, "create").mockImplementation(async (user1) => mockUserRepo.create(user1));

    const response = await request(app).post("/api/signup").send({ approved: true, requestId: userReq.id }).set("Authorization", `Bearer ${USER_TOKEN}`);

    expect(response.statusCode).toBe(200);
    expect(response.text).toContain("User successfully approved and created");
  });

  it("should fail to create the user if the request was rejected", async () => {
    jest.spyOn(UserRequestSQLRepository.prototype, "get").mockImplementation(async (requestId) => mockUserReqRepo.get(requestId));
    jest.spyOn(UserRequestSQLRepository.prototype, "update").mockImplementation(async (userReq) => mockUserReqRepo.update(userReq))

    const response = await request(app).post("/api/signup").send({ approved: false, requestId: userReq.id }).set("Authorization", `Bearer ${USER_TOKEN}`);

    expect(response.statusCode).toBe(403);
    expect(response.text).toContain("Forbidden! User request has not been approved");
  });

  it("should fail to create the user if the request was rejected", async () => {
    jest.spyOn(UserRequestSQLRepository.prototype, "get").mockImplementation(async (requestId) => mockUserReqRepo.get(requestId));
    jest.spyOn(UserRequestSQLRepository.prototype, "update").mockImplementation(async (userReq) => mockUserReqRepo.update(userReq))

    const response = await request(app).post("/api/signup").send({ approved: false, requestId: userReq.id }).set("Authorization", `Bearer ${USER_TOKEN}`);

    expect(response.statusCode).toBe(403);
    expect(response.text).toContain("Forbidden! User request has not been approved");

  });


  it("should fail to create the user if the request type was not SIGNUP", async () => {
    jest.spyOn(UserRequestSQLRepository.prototype, "get").mockImplementation(async () => notSignupUserReq);
    jest.spyOn(UserRequestSQLRepository.prototype, "update").mockImplementation(async (userReq) => mockUserReqRepo.update(notSignupUserReq))

    const response = await request(app).post("/api/signup").send({ approved: false, requestId: notSignupUserReq.id }).set("Authorization", `Bearer ${USER_TOKEN}`);

    expect(response.statusCode).toBe(400);
    expect(response.text).toContain("Bad request: The request does not meet the required criteria");
  });

  it("should fail to create the user if the request had a decision already made", async () => {
    jest.spyOn(UserRequestSQLRepository.prototype, "get").mockImplementation(async () => decisionMadeUserReq);
    jest.spyOn(UserRequestSQLRepository.prototype, "update").mockImplementation(async (userReq) => mockUserReqRepo.update(decisionMadeUserReq))

    const response = await request(app).post("/api/signup").send({ approved: false, requestId: decisionMadeUserReq.id }).set("Authorization", `Bearer ${USER_TOKEN}`);

    expect(response.statusCode).toBe(400);
    expect(response.text).toContain("Bad request: The request does not meet the required criteria");
  });



});
