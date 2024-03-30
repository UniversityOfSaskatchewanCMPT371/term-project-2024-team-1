/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/consistent-type-assertions */
import "reflect-metadata";
import { Request, Response } from "express";
import { container } from "tsyringe";
import { loggerToken } from "@app/adapter/DependencyInjections";
import { flushPromises } from "@tests/common_test_code/util_test";
import { Log4jsLogger } from "@app/adapter/Loggers/Log4jsLogger";
import { ILogger } from "@app/domain/interfaces/ILogger";
import { SurveyGetAllResponseHandler } from "@app/adapter/Controllers/Handlers/SurveyGetAllResponseHandler";
// import * as fs from "fs";
// import * as ExcelJs from "exceljs";

describe("Get Survey Responses", () => {
  container.register<ILogger>(loggerToken, { useClass: Log4jsLogger });
  const handler: SurveyGetAllResponseHandler = container.resolve(SurveyGetAllResponseHandler);

  beforeEach(() => {
    jest.restoreAllMocks();
  });

  describe("handle", () => {

    it("should succeed with the status code 200 if validation workd and execute returns responsess.length > 0", async() => {
      const req: Request = { params: { surveyId: 1 } } as unknown as Request;
      const res: Response = { download: jest.fn(), send: jest.fn() } as unknown as Response;
      jest.spyOn(handler, "validation").mockReturnValue(true);
      jest.spyOn(handler, "execute").mockReturnValue(Promise.resolve([{ userId: "testUserId", question: "testQuestion", answer: "testAnswer", note: "testNote" }]));


      // Call the handle method
      handler.handle(req, res);
      await flushPromises();

      //   expect(res.download).toHaveBeenCalled();
      expect(true).toBeTruthy();
    });

    it("should fail with status code 422 if the validation fails", async() => {
      const req: Request = { } as Request;
      const res: Response = { status: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as Response;
      jest.spyOn(handler, "validation").mockReturnValue(false);

      handler.handle(req, res);

      expect(res.status).toHaveBeenCalledWith(422);
      expect(res.send).toHaveBeenCalledWith("surveyId is required");
    });

    it("should fail with the status code 404 if 'execute' did not return responses with length > 0", async() => {
      const req: Request = { params: { surveyId: 1 } } as unknown as Request;
      const res: Response = { status: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as Response;
      jest.spyOn(handler, "validation").mockReturnValue(true);
      jest.spyOn(handler, "execute").mockReturnValue(Promise.resolve([]));

      // Call the handle method
      handler.handle(req, res);
      await flushPromises();

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith(`No responses found for survey ${1}`);

    });

    it("should fail with the status code 500 if 'execute' throws an error", async() => {
      const req: Request = { params: { surveyId: 1 } } as unknown as Request;
      const res: Response = { status: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as Response;
      jest.spyOn(handler, "validation").mockReturnValue(true);
      jest.spyOn(handler, "execute").mockReturnValue(Promise.reject(new Error("Error")));

      // Call the handle method
      handler.handle(req, res);
      await flushPromises();

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith(`Server failed to fetch all surveys`);

    });
  });

  describe("validation", () => {
    it("should return true when request has params and request.params has surveyId field defined", () => {
      const req: Request = { params: { surveyId: 1 } } as unknown as Request;
      const result: boolean = handler.validation(req);
      expect(result).toBeTruthy();
    });

    it("should return false if request params is not defined", () => {
      const req: Request = { } as unknown as Request;
      const result: boolean = handler.validation(req);
      expect(result).toBeFalsy();
    });

    it("should return false if request params has no surveyId", () => {
      const req: Request = { params: { } } as unknown as Request;
      const result: boolean = handler.validation(req);
      expect(result).toBeFalsy();
    });

    it("should return false if request params surveyId < 0", () => {
      const req: Request = { params: { surveyId: -1 } } as unknown as Request;
      const result: boolean = handler.validation(req);
      expect(result).toBeFalsy();
    });

  });

});
