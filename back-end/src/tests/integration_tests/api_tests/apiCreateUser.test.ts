/* eslint-disable @typescript-eslint/typedef */
import { loggerToken, userRepoToken, userReqRepoToken } from "@app/adapter/DependencyInjections";
import { Log4jsLogger } from "@app/adapter/Loggers/Log4jsLogger";
import { UserSQLRepository } from "@app/adapter/SQLRepositories/User/UserSQLRepository";
import { UserRequestSQLRepository } from "@app/adapter/SQLRepositories/UserRequest/UserRequestSQLRepository";
import { UserRequestService } from "@app/application/UserRequestService";
import { UserService } from "@app/application/UserService";
import { RequestStatusEnum } from "@app/domain/RequestStatusEnum";
import { RequestTypeEnum } from "@app/domain/RequestTypeEnum";
import { User } from "@app/domain/User";
import { UserRequest } from "@app/domain/UserRequest";
import { ILogger } from "@app/domain/interfaces/ILogger";
import { IUserRepository } from "@app/domain/interfaces/repositories/IUserRepository";
import { IUserRequestRepository } from "@app/domain/interfaces/repositories/IUserRequestRepository";
import { MockUserRepository } from "@tests/mocked_repository/MockUserRepository";
import { MockUserRequestRepository } from "@tests/mocked_repository/MockUserRequestRepository";
import "reflect-metadata";
import request from "supertest";
import { container } from "tsyringe";
import { app } from "../../../main";

// register dependency
const mockUserReqRepo: IUserRequestRepository = new MockUserRequestRepository();
const mockUserRepo: IUserRepository = new MockUserRepository();
container.register<ILogger>(loggerToken, { useClass: Log4jsLogger });
container.register<IUserRequestRepository>(userReqRepoToken, { useValue: mockUserReqRepo });
container.register<IUserRepository>(userRepoToken, { useValue: mockUserRepo });

const ADMIN_TOKEN: string = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0MTIzNDUiLCJpYXQiOjE3MTA2Mzc5MTJ9.YSpO-XXbZdGZrZb7-MANJB1KKNwPOq5LTwwqrlAP5pY";
const USER_TOKEN: string = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0MTIzNDUiLCJpYXQiOjE3MDk2NzIxODd9.MFSQJhBnwwB2rXGbUzmxycmUIdhMDFz4hhN4jBcJtFM";

describe("Create User API Test /api/user/request", () => {
  let userReq: UserRequest;
  let notSignupUserReq: UserRequest;
  let decisionMadeUserReq: UserRequest;
  const admin: User = new User("testClinic", "test12345", "test@gmail.com", true, "smkfomg452AM$");
  const user: User = new User("testClinic", "test12345", "test@gmail.com", false, "smkfomg452AM$");
  
  beforeEach(() => {
    userReq = new UserRequest(1, "test@gmail.com", "testClinic", "$2a$10$jIRie1ZM8CVysp4olOIoqOviEcG.kPWQutEftr5897GD54Cr0uNcS", RequestStatusEnum.AWAITING, new Date(), RequestTypeEnum.SIGNUP, null);
    notSignupUserReq = new UserRequest(2, "user1@gmail.com", "clinic1", "password1", RequestStatusEnum.AWAITING, new Date(), RequestTypeEnum.PASSWORD_RESET, null);
    decisionMadeUserReq = new UserRequest(3, "user1@gmail.com", "clinic1", "password1", RequestStatusEnum.APPROVED, new Date(), RequestTypeEnum.PASSWORD_RESET, new Date());

    jest.spyOn(UserRequestSQLRepository.prototype, "get").mockImplementation(async (requestId) => mockUserReqRepo.get(requestId));
    jest.spyOn(UserService.prototype, "get").mockImplementation(async () => admin);
    jest.spyOn(UserRequestService.prototype, "update").mockImplementation(async () => true);
  });

  it("should successfully create the user if the request was approved", async () => {
    await mockUserReqRepo.create(userReq);
    jest.spyOn(UserRequestSQLRepository.prototype, "update").mockImplementation(async (userReq) => mockUserReqRepo.update(userReq));
    jest.spyOn(UserSQLRepository.prototype, "create").mockImplementation(async (user1) => mockUserRepo.create(user1));
    jest.spyOn(UserRequestService.prototype, "get").mockImplementation(async () => userReq);

    const requestId = userReq.id;
    const response = await request(app).patch(`/api/user/request/${requestId}`).send({ approved: true }).set("Authorization", `Bearer ${ADMIN_TOKEN}`);

    expect(response.statusCode).toBe(201);
    expect(response.text).toContain("User successfully approved and created");
  });

  it("should successfully update the request if the request was rejected", async () => {
    await mockUserReqRepo.create(userReq);
    jest.spyOn(UserRequestSQLRepository.prototype, "update").mockImplementation(async (userReq) => mockUserReqRepo.update(userReq));
    jest.spyOn(UserRequestService.prototype, "get").mockImplementation(async () => userReq);

    const requestId = userReq.id;
    const response = await request(app).patch(`/api/user/request/${requestId}`).send({ approved: false }).set("Authorization", `Bearer ${ADMIN_TOKEN}`);

    expect(response.statusCode).toBe(200);
    expect(response.text).toContain("Successfully updated user request status 1");
  });

  it("should fail to create the user if the request type was not SIGNUP", async () => {
    await mockUserReqRepo.create(notSignupUserReq);
    jest.spyOn(UserRequestSQLRepository.prototype, "get").mockImplementation(async () => notSignupUserReq);
    jest.spyOn(UserRequestSQLRepository.prototype, "update").mockImplementation(async (userReq) => mockUserReqRepo.update(notSignupUserReq));
    jest.spyOn(UserRequestService.prototype, "get").mockImplementation(async () => notSignupUserReq);

    const requestId = notSignupUserReq.id;
    const response = await request(app).patch(`/api/user/request/${requestId}`).send({ approved: false }).set("Authorization", `Bearer ${ADMIN_TOKEN}`);

    expect(response.statusCode).toBe(400);
    expect(response.text).toContain("Bad request: The request does not meet the required criteria");
  });

  it("should fail to create the user if the request had a decision already made", async () => {
    await mockUserReqRepo.create(decisionMadeUserReq);
    jest.spyOn(UserRequestSQLRepository.prototype, "get").mockImplementation(async () => decisionMadeUserReq);
    jest.spyOn(UserRequestSQLRepository.prototype, "update").mockImplementation(async (userReq) => mockUserReqRepo.update(decisionMadeUserReq));
    jest.spyOn(UserRequestService.prototype, "get").mockImplementation(async () => decisionMadeUserReq);

    const requestId = decisionMadeUserReq.id;
    const response = await request(app).patch(`/api/user/request/${requestId}`).send({ approved: true }).set("Authorization", `Bearer ${ADMIN_TOKEN}`);

    expect(response.statusCode).toBe(400);
    expect(response.text).toContain("Bad request: The request does not meet the required criteria");
  });

  it("should fail to create the user if the endpoint was hit by a non-ADMIN user", async () => {
    await mockUserReqRepo.create(decisionMadeUserReq);
    jest.spyOn(UserRequestSQLRepository.prototype, "get").mockImplementation(async () => decisionMadeUserReq);
    jest.spyOn(UserRequestSQLRepository.prototype, "update").mockImplementation(async (userReq) => mockUserReqRepo.update(decisionMadeUserReq));
    jest.spyOn(UserRequestService.prototype, "get").mockImplementation(async () => decisionMadeUserReq);
    jest.spyOn(UserService.prototype, "get").mockImplementation(async () => user);

    const requestId = decisionMadeUserReq.id;
    const response = await request(app).patch(`/api/user/request/${requestId}`).send({ approved: true }).set("Authorization", `Bearer ${USER_TOKEN}`);

    expect(response.statusCode).toBe(403);
    expect(response.text).toContain("Unauthorized access, you do not have permissions!");
  });
});
