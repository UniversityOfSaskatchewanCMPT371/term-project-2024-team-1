/* eslint-disable prefer-const */
import { loggerToken, userRepoToken } from "@app/adapter/DependencyInjections";
import { Log4jsLogger } from "@app/adapter/Loggers/Log4jsLogger";
import { ILogger } from "@app/domain/interfaces/ILogger";
import { IUserRepository } from "@app/domain/interfaces/repositories/IUserRepository";
import { MockUserRepository } from "@tests/mocked_repository/MockUserRepository";
import { container } from "tsyringe";
import request from "supertest";
import { User } from "@app/domain/User";
import jwt from "jsonwebtoken";
import { randomAlphanumString } from "@app/application/util";
import app from "src/main";
import { ACCESS_TOKEN_SECRET } from "@resources/config";
import { UserSQLRepository } from "@app/adapter/SQLRepositories/User/UserSQLRepository";

describe("UserDelete System Test", () => {
  const mockUserRepo: IUserRepository = new MockUserRepository();
  container.register<IUserRepository>(userRepoToken, { useValue: mockUserRepo });
  container.register<ILogger>(loggerToken, { useClass: Log4jsLogger });

  const user1: User = new User(randomAlphanumString(4), randomAlphanumString(12), randomAlphanumString(6), false);
  const user2: User = new User(randomAlphanumString(4), randomAlphanumString(12), randomAlphanumString(6), false);
  const user3: User = new User(randomAlphanumString(4), randomAlphanumString(12), randomAlphanumString(6), false);
  const adminUser1: User = new User(randomAlphanumString(4), randomAlphanumString(12), randomAlphanumString(6), true);



  beforeEach(() => {
    void mockUserRepo.create(user1);
    void mockUserRepo.create(user2);
    void mockUserRepo.create(user3);
    void mockUserRepo.create(adminUser1);
    jest.restoreAllMocks();
  });

  it("should fail with 401 to delete if user is not logged in", async () => {
    await request(app)
      .delete(`/api/user/${user1.userId}`)
      .expect(401);
  });

  it("should fail to delete if user is not admin", async () => {
    const userAuthToken: string = jwt.sign({ userId: user1.userId }, ACCESS_TOKEN_SECRET, { expiresIn: "5s" });

    await request(app)
      .delete(`/api/user/${user3.userId}`)
      .set("Authorization", `Bearer ${userAuthToken}`)
      .expect(403);

    return expect(mockUserRepo.get(user3.userId)).resolves.toBe(user3);
  });

  it("should delete user from database if user is admin", async () => {
    
    const adminUserAuthToken: string = jwt.sign({ userId: adminUser1.userId }, ACCESS_TOKEN_SECRET, { expiresIn: "5s" });
    jest.spyOn(UserSQLRepository.prototype, "delete").mockImplementation(async (userId) => mockUserRepo.delete(userId));
    await request(app)
      .delete(`/api/user/${user3.userId}`)
      .set("Authorization", `Bearer ${adminUserAuthToken}`)
      .expect(200);

    expect.assertions(1);
    return expect(mockUserRepo.get(user3.userId)).resolves.toBe(null);
  });

  it("should handle error gracefully if database operation fails", async () => {
    const adminUserAuthToken: string = jwt.sign({ userId: adminUser1.userId }, ACCESS_TOKEN_SECRET, { expiresIn: "5s" });
    
    await request(app)
      .delete(`/api/user/${user3.userId}`)
      .set("Authorization", `Bearer ${adminUserAuthToken}`)
      .expect(500);
  });

});
