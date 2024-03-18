/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-labels */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/typedef */
/* eslint-disable prefer-const */
import { loggerToken, userRepoToken } from "@app/adapter/DependencyInjections";
import { Log4jsLogger } from "@app/adapter/Loggers/Log4jsLogger";
import { UserSQLRepository } from "@app/adapter/SQLRepositories/User/UserSQLRepository";
import { randomAlphanumString } from "@app/application/util";
import { User } from "@app/domain/User";
import { ILogger } from "@app/domain/interfaces/ILogger";
import { IUserRepository } from "@app/domain/interfaces/repositories/IUserRepository";
import { ACCESS_TOKEN_SECRET } from "@resources/config";
import { MockUserRepository } from "@tests/mocked_repository/MockUserRepository";
import jwt from "jsonwebtoken";
import app from "src/main";
import request from "supertest";
import { container } from "tsyringe";

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

  it("should fail to delete user from db if not logged in, expect user to still be in database", async () => {
    await request(app)
      .delete(`/api/user/${user1.userId}`)
      .expect(401);

    await expect(mockUserRepo.get(user1.userId)).resolves.toBe(user1);
  });

  it("should fail to delete user from db if not admin, expect user to still be in database", async () => {
    const userAuthToken: string = jwt.sign({ userId: user1.userId }, ACCESS_TOKEN_SECRET, { expiresIn: "5s" });

    await request(app)
      .delete(`/api/user/${user3.userId}`)
      .set("Authorization", `Bearer ${userAuthToken}`)
      .expect(403);

    await expect(mockUserRepo.get(user3.userId)).resolves.toBe(user3);
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

  it("should not delete user from database if database delete operation fails", async () => {
    const adminUserAuthToken: string = jwt.sign({ userId: adminUser1.userId }, ACCESS_TOKEN_SECRET, { expiresIn: "5s" });
    jest.spyOn(UserSQLRepository.prototype, "delete").mockRejectedValue("Database Error");

    await request(app)
      .delete(`/api/user/${user3.userId}`)
      .set("Authorization", `Bearer ${adminUserAuthToken}`)
      .expect(500);

    await expect(mockUserRepo.get(user3.userId)).resolves.toBe(user3);
  });
  
});
