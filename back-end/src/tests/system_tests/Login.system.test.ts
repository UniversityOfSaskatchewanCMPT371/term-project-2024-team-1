/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/typedef */
import { loggerToken, userRepoToken } from "@app/adapter/DependencyInjections";
import { Log4jsLogger } from "@app/adapter/Loggers/Log4jsLogger";
import { randomAlphanumString } from "@app/application/util";
import { User } from "@app/domain/User";
import { ILogger } from "@app/domain/interfaces/ILogger";
import { IUserRepository } from "@app/domain/interfaces/repositories/IUserRepository";
import { MockUserRepository } from "@tests/mocked_repository/MockUserRepository";
import { container } from "tsyringe";
import request from "supertest";
import app from "src/main";
import bcrypt from "bcrypt";
import { flushPromises } from "@tests/common_test_code/util_test";
import { UserSQLRepository } from "@app/adapter/SQLRepositories/User/UserSQLRepository";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "@resources/config";

describe("Login System Test", () => {

  const mockUserRepo: IUserRepository = new MockUserRepository();
  container.register<IUserRepository>(userRepoToken, { useValue: mockUserRepo });
  container.register<ILogger>(loggerToken, { useClass: Log4jsLogger });

  const user1pw: string = randomAlphanumString(6);
  const user2pw: string = randomAlphanumString(6);
  const user3pw: string = randomAlphanumString(6);
  let user1pwH: string;
  let user2pwH: string;
  let user3pwH: string;

  let user1: User;
  let user2: User;
  let user3: User;
  const adminUser1: User = new User(randomAlphanumString(4), randomAlphanumString(12), randomAlphanumString(6), true);

  beforeEach(() => {
    jest.restoreAllMocks();
    user1pwH = bcrypt.hashSync(user1pw, 5);
    user1 = new User(randomAlphanumString(4), randomAlphanumString(12), randomAlphanumString(6), false, user1pwH);
    user2pwH = bcrypt.hashSync(user2pw, 5);
    user2 = new User(randomAlphanumString(4), randomAlphanumString(12), randomAlphanumString(6), false, user2pwH);
    user3pwH = bcrypt.hashSync(user3pw, 5);
    user3 = new User(randomAlphanumString(4), randomAlphanumString(12), randomAlphanumString(6), false, user3pwH);

    void mockUserRepo.create(user1);
    void mockUserRepo.create(user2);
    void mockUserRepo.create(user3);
    void mockUserRepo.create(adminUser1);
    void flushPromises();
  });

  it("should fail with if bcrypt comparison returns false", async () => {
    const loginInfo: object = { userIdEmail: user1.email, password: randomAlphanumString(15) };
    
    const userSQLGetSpy = jest.spyOn(UserSQLRepository.prototype, "get").mockImplementation(async (userIdEmail) => mockUserRepo.get(userIdEmail));
    const bcryptCompareSpy = jest.spyOn(bcrypt, "compare");

    await request(app)
      .post("/api/login")
      .send(loginInfo)
      .expect(403);

    const bcryptCompareSpyResult: Promise<boolean> = bcryptCompareSpy.mock.results[0].value;

    expect(userSQLGetSpy).toHaveBeenCalled();
    await expect(bcryptCompareSpyResult).resolves.toEqual(false);
  });

  it("should call to bcrypt compare with the request password and user password", async () => {
    const randomPassword = randomAlphanumString(15);
    const loginInfo: object = { userIdEmail: user1.email, password: randomPassword };
    jest.spyOn(UserSQLRepository.prototype, "get").mockImplementation(async (userIdEmail) => mockUserRepo.get(userIdEmail));
    const bcryptCompareSpy = jest.spyOn(bcrypt, "compare");

    await request(app)
      .post("/api/login")
      .send(loginInfo);

    expect(bcryptCompareSpy).toHaveBeenCalled();
    expect(bcryptCompareSpy).toHaveBeenCalledWith(randomPassword, user1.password);
  });

  it("should call jwt.sign upon successful user verification", async () => {
    const loginInfo: object = { userIdEmail: user1.email, password: user1pw };
    
    jest.spyOn(UserSQLRepository.prototype, "get").mockImplementation(async (userIdEmail) => mockUserRepo.get(userIdEmail));
    const jwtSignSpy = jest.spyOn(jwt, "sign");
    
    await request(app)
      .post("/api/login")
      .send(loginInfo)
      .expect(200);
    
    expect(jwtSignSpy).toHaveBeenCalled();
  });

  it("should return true from bcrypt comparison if passwords match", async () => {
    const loginInfo: object = { userIdEmail: user1.email, password: user1pw };
    
    jest.spyOn(UserSQLRepository.prototype, "get").mockImplementation(async (userIdEmail) => mockUserRepo.get(userIdEmail));
    const bcryptCompareSpy = jest.spyOn(bcrypt, "compare");
    
    void flushPromises();
    await request(app)
      .post("/api/login")
      .send(loginInfo)
      .expect(200);

    expect(bcryptCompareSpy).toHaveBeenCalled();
    expect(bcryptCompareSpy).toHaveBeenCalledWith(user1pw, user1.password);
  });


  it("should be able to login with userId", async () => {
    const loginInfo: object = { userIdEmail: user1.userId, password: user1pw };
    
    jest.spyOn(UserSQLRepository.prototype, "get").mockImplementation(async (userIdEmail) => mockUserRepo.get(userIdEmail));
    const accessToken = jwt.sign({ userId: user1.userId }, ACCESS_TOKEN_SECRET, { expiresIn: "5s" });
    jest.spyOn(jwt, "sign").mockImplementation(() => {
      return { userId: user1.userId, role: "USER", accessToken };
    });

    await request(app)
      .post("/api/login")
      .send(loginInfo)
      .expect(200);
  });
  
  it("should call jwt.sign to get a valid accessToken for user", async () => {
    const loginInfo: object = { userIdEmail: user1.userId, password: user1pw };
    
    jest.spyOn(UserSQLRepository.prototype, "get").mockImplementation(async (userIdEmail) => mockUserRepo.get(userIdEmail));
    // Mocking this out so the token doesn't actually last a long time; token expires after this test is done
    const accessToken = jwt.sign({ userId: user1.userId }, ACCESS_TOKEN_SECRET, { expiresIn: "5s" });
    jest.spyOn(jwt, "sign").mockImplementation(() => {
      return { userId: user1.userId, role: "USER", accessToken };
    });

    const requestResponse = await request(app)
      .post("/api/login")
      .send(loginInfo)
      .expect(200);

    expect(requestResponse.body.userId).toBeDefined();
    expect(requestResponse.body.role).toBeDefined();
    expect(requestResponse.body.accessToken).toBeDefined();
    expect(requestResponse.body.accessToken.accessToken).toEqual(accessToken);
  });
});
