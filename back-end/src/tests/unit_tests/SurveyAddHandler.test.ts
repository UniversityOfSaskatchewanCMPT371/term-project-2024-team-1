// /* eslint-disable */
// import "reflect-metadata";
// import { Request, Response } from "express";
// import { SurveyAddHandler } from "@app/adapter/Controllers/Handlers/SurveyAddHandler";
// import { SurveyService } from "@app/application/SurveyService";
// import { ISurveyRepository } from "@app/domain/interfaces/repositories/ISurveyRepository";
// import { MockSurveyRepository } from "@tests/mocked_repository/MockSurveyRepository";
// import { Survey } from "@app/domain/Survey";

// // Assuming jest.mock is not necessary if you are instantiating directly in the test.
// // jest.mock("@app/application/SurveyService");

// describe("SurveyAddHandler Tests", () => {
//   let surveyService: SurveyService;
//   let surveyAddHandler: SurveyAddHandler;

//   // Helper function to create a mock Response object
//   // eslint-disable-next-line @typescript-eslint/typedef
//   const mockResponse = (): Response => {
//     const res: any = {};
//     res.status = jest.fn().mockReturnValue(res);
//     res.send = jest.fn().mockReturnValue(res);
//     res.json = jest.fn().mockReturnValue(res);
//     return res as Response;
//   };

//   beforeEach(() => {
//     // Directly instantiate the surveyService with a mock repository
//     const mockSurveyRepository: ISurveyRepository = new MockSurveyRepository();
//     surveyService = new SurveyService(mockSurveyRepository);
//     surveyAddHandler = new SurveyAddHandler(surveyService);
//   });

//   it("should successfully add a survey and return 200", async () => {
//     const req: Request = { body: { surveyName: "New Survey" } } as Request;
//     const res = mockResponse();

//     // Mock the createSurvey method to simulate a successful survey creation
//     jest.spyOn(surveyService, 'createSurvey').mockResolvedValueOnce(true);

//     await surveyAddHandler.handle(req, res);

//     expect(res.status).toHaveBeenCalledWith(200);
//     expect(res.send).toHaveBeenCalledWith("Sample survey added successfully.");
//   });

//   it("should return 400 if the survey creation fails", async () => {
//     const req: Request = { body: { surveyName: "Incomplete Data" } } as Request;
//     const res = mockResponse();

//     // Simulate survey creation failure
//     jest.spyOn(surveyService, 'createSurvey').mockResolvedValueOnce(false);

//     await surveyAddHandler.handle(req, res);

//     expect(res.status).toHaveBeenCalledWith(400);
//     expect(res.send).toHaveBeenCalledWith("Failed to add sample survey.");
//   });

//   it("should return 500 if an error occurs during survey creation", async () => {
//     const req: Request = { body: { surveyName: "Error Prone Survey" } } as Request;
//     const res = mockResponse();

//     // Simulate an error during survey creation
//     jest.spyOn(surveyService, 'createSurvey').mockRejectedValueOnce(new Error("Unexpected error"));

//     await surveyAddHandler.handle(req, res);

//     expect(res.status).toHaveBeenCalledWith(500);
//     expect(res.send).toHaveBeenCalledWith("Error occurred while adding sample survey.");
//   });
// });
