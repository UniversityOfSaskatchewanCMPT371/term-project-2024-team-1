// /* eslint-disable */
// import "reflect-metadata";
// import { Request, Response } from "express";
// import { SurveyQuestionAddHandler } from "@app/adapter/Controllers/Handlers/SurveyQuestionAddHandler";
// import { SurveyService } from "@app/application/SurveyService";
// import { ISurveyRepository } from "@app/domain/interfaces/repositories/ISurveyRepository";
// import { MockSurveyRepository } from "../mocked_repository/MockSurveyRepository";

// // Mock the entire SurveyService module
// jest.mock("@app/application/SurveyService", () => {
//   return {
//     SurveyService: jest.fn().mockImplementation(() => ({
//       addQuestionToSurvey: jest.fn(),
//     })),
//   };
// });

// describe("SurveyQuestionAddHandler Tests", () => {
//   let surveyQuestionAddHandler: SurveyQuestionAddHandler;
//   let surveyService: jest.Mocked<SurveyService>;
//   let mockSurveyRepository: ISurveyRepository;

//   // Helper function to create a mock Response object
//   const mockResponse = (): Response => {
//     const res: any = {};
//     res.status = jest.fn().mockReturnValue(res);
//     res.json = jest.fn().mockReturnValue(res);
//     return res as Response;
//   };

//   beforeEach(() => {
//     // Clear mocks and setup fresh for each test
//     jest.clearAllMocks();

//     mockSurveyRepository = new MockSurveyRepository();
//     // Since SurveyService is mocked, we instantiate it directly without real repository
//     surveyService = new SurveyService(mockSurveyRepository) as jest.Mocked<SurveyService>;
//     surveyQuestionAddHandler = new SurveyQuestionAddHandler(surveyService);
//   });

//   it("should successfully add a question to a survey and return 200", async () => {
//     const req: Request = { body: { surveyId: 1, questionId: 2, rank: 1 } } as Request;
//     const res = mockResponse();

//     // Mock the addQuestionToSurvey method for success
//     surveyService.addQuestionToSurvey.mockResolvedValueOnce(true);

//     await surveyQuestionAddHandler.handle(req, res);

//     expect(res.status).toHaveBeenCalledWith(200);
//     expect(res.json).toHaveBeenCalledWith({ message: "Question added to survey successfully." });
//   });

//   it("should return 400 if the service indicates failure to add question", async () => {
//     const req: Request = { body: { surveyId: 1, questionId: 2, rank: 1 } } as Request;
//     const res = mockResponse();

//     // Mock the addQuestionToSurvey method for failure
//     surveyService.addQuestionToSurvey.mockResolvedValueOnce(false);

//     await surveyQuestionAddHandler.handle(req, res);

//     expect(res.status).toHaveBeenCalledWith(400);
//     expect(res.json).toHaveBeenCalledWith({ message: "Failed to add question to survey." });
//   });

//   it("should return 500 if an error occurs during question addition", async () => {
//     const req: Request = { body: { surveyId: 1, questionId: 2, rank: 1 } } as Request;
//     const res = mockResponse();

//     // Mock the addQuestionToSurvey method to simulate an error
//     surveyService.addQuestionToSurvey.mockRejectedValueOnce(new Error("Unexpected error"));

//     await surveyQuestionAddHandler.handle(req, res);

//     expect(res.status).toHaveBeenCalledWith(500);
//     expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "Internal server error" }));
//   });
// });
