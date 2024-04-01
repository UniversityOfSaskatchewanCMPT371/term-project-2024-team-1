/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/consistent-type-assertions */
import "reflect-metadata";
import { SurveyGetAllHandler } from "@app/adapter/Controllers/Handlers/SurveyGetAllHandler";
import { ISurveyRepository } from "@app/domain/interfaces/repositories/ISurveyRepository";
import { loggerToken, surveyRepoToken } from "@app/adapter/DependencyInjections";
import { Log4jsLogger } from "@app/adapter/Loggers/Log4jsLogger";
import { randomAlphanumString } from "@app/application/util";
import { ILogger } from "@app/domain/interfaces/ILogger";
import { Survey } from "@app/domain/Survey";
import { MockSurveyRepository } from "@tests/mocked_repository/MockSurveyRepository";
import { container } from "tsyringe";
import { Request, Response } from "express";
import { flushPromises } from "@tests/common_test_code/util_test";

describe("SurveyGetAllHander", () => {
  const mockSurveyRepo: ISurveyRepository = new MockSurveyRepository();
  container.register(surveyRepoToken, { useValue: mockSurveyRepo });
  container.register<ILogger>(loggerToken, { useClass: Log4jsLogger });
 

  const handler: SurveyGetAllHandler = container.resolve(SurveyGetAllHandler);

  let req: Request;
  let res: Response;

  beforeEach(() => {
    jest.restoreAllMocks();
    req = { } as Request;
    res = { status: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as Response;
  });

  describe("handle", () => {
    it("should return 200 if successfully fetched surveys", async () => {
      // Setup
      const surveys: Survey[] = [
        new Survey(0, randomAlphanumString(10), new Date()),
        new Survey(1, randomAlphanumString(10), new Date()),
        new Survey(2, randomAlphanumString(10), new Date())
      ];
      jest.spyOn(mockSurveyRepo, "getAll").mockResolvedValue(surveys);

      // Action
      handler.handle(req, res);
      await flushPromises();

      // Assert
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should return list of surveys if there are surveys", async () => {
      // Setup
      const surveys: Survey[] = [
        new Survey(0, randomAlphanumString(10), new Date()),
        new Survey(1, randomAlphanumString(10), new Date()),
        new Survey(2, randomAlphanumString(10), new Date())
      ];
      jest.spyOn(mockSurveyRepo, "getAll").mockResolvedValue(surveys);

      // Action
      handler.handle(req, res);
      await flushPromises();

      // Assert
      expect(res.send).toHaveBeenCalledWith(surveys);
    });

    it("should return empty list of there are surveys fetched", async () => {
      // Setup
      jest.spyOn(mockSurveyRepo, "getAll").mockResolvedValue([]);

      // Action
      handler.handle(req, res);
      await flushPromises();

      // Assert
      expect(res.send).toHaveBeenCalledWith([]);
    });

    it("should return 500 if database operation failed to fetch surveys", async () => {
      jest.spyOn(mockSurveyRepo, "getAll").mockRejectedValue("Failed to get all surveys");

      // Action
      handler.handle(req, res);
      await flushPromises();

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

});
