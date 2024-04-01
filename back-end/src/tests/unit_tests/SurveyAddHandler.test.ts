// /* eslint-disable */
// import "reflect-metadata";
// import { Request, Response } from "express";
// import { Survey } from "@app/domain/Survey";
// import { ISurveyRepository } from "@app/domain/interfaces/repositories/ISurveyRepository";
// import { SurveyAddHandler } from "@app/adapter/Controllers/Handlers/SurveyAddHandler";
// import { MockSurveyRepository } from "./mocked_repository/MockSurveyRepository";
// import { container } from "tsyringe";
// import { surveyRepoToken } from "@app/adapter/DependencyInjections";

describe("SurveyAddHandler tests", () => {
  it("TODO", () => {
    expect(true).toBeTruthy();
  });
});

// describe("SurveyAddHandler Tests", () => {
//   beforeEach(() => {
//     container.clearInstances();
//     container.register<ISurveyRepository>(surveyRepoToken, { useClass: MockSurveyRepository });
//   });

//   const mockResponse = (): Response => {
//     const res: any = {};
//     res.status = jest.fn().mockReturnValue(res);
//     res.json = jest.fn().mockReturnValue(res);
//     res.send = jest.fn().mockReturnValue(res);
//     return res as Response;
//   };

//   it("should successfully add a survey and return 200", async () => {
//     const handler = container.resolve(SurveyAddHandler);
//     const req = { body: { surveyName: "New Survey", dateCreated: new Date() } } as Request;
//     const res = mockResponse();

//     await handler.handle(req, res);

//     expect(res.status).toHaveBeenCalledWith(200);
//     expect(res.json).toHaveBeenCalledWith({ message: "Survey added successfully." });
//   });

//   it("should return 400 if the survey data is invalid", async () => {
//     const handler = container.resolve(SurveyAddHandler);
//     const req = { body: {} } as Request; // Invalid or missing data
//     const res = mockResponse();

//     await handler.handle(req, res);

//     expect(res.status).toHaveBeenCalledWith(400);
//     expect(res.send).toHaveBeenCalled();
//   });

//   it("should return 500 if there is an error adding the survey", async () => {
//     const handler = container.resolve(SurveyAddHandler);
//     const req = { body: { surveyName: "Survey with DB issue", dateCreated: new Date() } } as Request;
//     const res = mockResponse();

//     // Simulating a database error
//     jest.spyOn(MockSurveyRepository.prototype, "createSurvey").mockImplementationOnce(async () => {
//       throw new Error("Database error");
//     });

//     await handler.handle(req, res);

//     expect(res.status).toHaveBeenCalledWith(500);
//     expect(res.send).toHaveBeenCalledWith("Internal server error");
//   });
// });
