/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/typedef */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import request from "supertest";
import app from "../../../main";
import { query } from "@app/adapter/SQLRepositories/SQLConfiguration";
const {
  dropTables,
  createUserTable,
  createTables,
  createSurvey, 
  dropUserTable,
  createSurveyQuestionMap,
  createQuestion,
  createAnswer
} = require("./testSqlCommands");

const USER_TOKEN: string = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0MTIzNDUiLCJpYXQiOjE3MDk2NzIxODd9.MFSQJhBnwwB2rXGbUzmxycmUIdhMDFz4hhN4jBcJtFM";

// This test suite runs directly on a database. Change "xdescribe" to "describe" then run it.
xdescribe("API Test for Get /api/survey/:surveyId", () => {

  const surveyData1: any = {
    surveyName: "Survey 1",
    dateCreated: "2024-03-27 12:00:00",
    dueDate: "2024-04-10 12:00:00"
  };

  const mockQuestionData: any = {
    parentId: 1,
    question: "What is your favorite color?",
    standard: false,
    type: "Multiple Choice"
  };

  async function insertSurveyData(surveyName: string, aQuestion: string, questionId: number, surveyId: number): Promise<void> {
    await query(createSurvey, [surveyName, surveyData1.dateCreated, surveyData1.dueDate]);
    await query(createQuestion, [surveyId, aQuestion, mockQuestionData.standard, mockQuestionData.type]);
    await query(createSurveyQuestionMap, [surveyId, questionId, 1]);
    await query(createAnswer, ["Answer to Q1", questionId, "some random note", 1, 1]);
  }

  beforeAll(async () => {
    await query(dropTables);
    await query(dropUserTable);
    await query(createUserTable);
    await query(createTables);
  });

  it("should successfully connect to the API root endpoint", async () => {
    const response: any = await request(app).get("/");
    expect(response.status).toBe(200);
  });

  it("should successfully connect to the Survey endpoint", async () => {
    const response: any = await request(app).get("/api/survey").send({ approved: true }).set("Authorization", `Bearer ${USER_TOKEN}`);
    expect(response.status).toBe(200);
  });

  it("should return a 404 error when no survey in the database has been created", async () => {
    const response: any = await request(app).get("/api/survey/1").send({ approved: true }).set("Authorization", `Bearer ${USER_TOKEN}`);
    
    expect(response.status).toBe(404);
    expect(response.text).toBe("Survey 1 doesn't exist or does not have any questions added to it!");
  });

  it("should return a 404 error when a survey has been created but has no questions in it", async () => {
    const response: any = await request(app).get("/api/survey/1").send({ approved: true }).set("Authorization", `Bearer ${USER_TOKEN}`);
    
    expect(response.status).toBe(404);
    expect(response.text).toBe("Survey 1 doesn't exist or does not have any questions added to it!");
  });

  it("should succesfully retrieve the survey when one survey has been created with one question in it", async () => {

    await insertSurveyData("Survey 1", "What is your favorite color?", 1, 1);
    
    const response: any = await request(app).get("/api/survey/1").send({ approved: true }).set("Authorization", `Bearer ${USER_TOKEN}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body.some((obj: Record<string, any>) =>
      obj.parentId === 1 &&
    obj.question === "What is your favorite color?" &&
    obj.standard === 0 &&
    obj.type === "Multiple Choice" &&
    obj.rankOrder === 1
    )).toBe(true);
  
  });

  it("should succesfully retrieve the survey when the survey has multiple question in it", async () => {
    await query(createQuestion, [mockQuestionData.parentId, "Question 2?", mockQuestionData.standard, mockQuestionData.type]);
    await query(createSurveyQuestionMap, [1, 2, 1]);
    await query(createAnswer, ["Answer to Q1", 2, "some random note", 1, 1]);
    
    const response: any = await request(app).get("/api/survey/1").send({ approved: true }).set("Authorization", `Bearer ${USER_TOKEN}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body.some((obj: Record<string, any>) =>
      obj.parentId === 1 &&
    obj.question === "Question 2?" &&
    obj.standard === 0 &&
    obj.type === "Multiple Choice" &&
    obj.rankOrder === 1
    )).toBe(true);
  
  });


  it("should succesfully retrieve the first survey when multiple surveys exists", async () => {
    await insertSurveyData("Survey 2", "Survey2 Question?", 3, 2);
    await insertSurveyData("Survey 3", "Survey3 Question?", 4, 3);
    await insertSurveyData("Survey 4", "Survey4 Question?", 5, 4);
    await insertSurveyData("Survey 5", "Survey5 Question?", 6, 5);

    const response: any = await request(app).get("/api/survey/1").send({ approved: true }).set("Authorization", `Bearer ${USER_TOKEN}`);
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2); 
    expect(response.body.some((obj: Record<string, any>) =>
      obj.parentId === 1 &&
    obj.question === "What is your favorite color?" &&
    obj.standard === 0 &&
    obj.type === "Multiple Choice" &&
    obj.rankOrder === 1
    )).toBe(true);
  });

  it("should succesfully retrieve the last survey when multiple surveys exists", async () => {

    const response: any = await request(app).get("/api/survey/5").send({ approved: true }).set("Authorization", `Bearer ${USER_TOKEN}`);
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1); 
    expect(response.body.some((obj: Record<string, any>) =>
      obj.parentId === 5 &&
    obj.question === "Survey5 Question?" &&
    obj.standard === 0 &&
    obj.type === "Multiple Choice" &&
    obj.rankOrder === 1
    )).toBe(true);
  });

  it("should succesfully retrieve the middle survey when multiple surveys exists", async () => {

    const response: any = await request(app).get("/api/survey/3").send({ approved: true }).set("Authorization", `Bearer ${USER_TOKEN}`);
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1); 
    expect(response.body.some((obj: Record<string, any>) =>
      obj.parentId === 3 &&
    obj.question === "Survey3 Question?" &&
    obj.standard === 0 &&
    obj.type === "Multiple Choice" &&
    obj.rankOrder === 1
    )).toBe(true);
  });

  it("should return a 404 error when a surveyId that does not exist in the database is given", async () => {

    const response: any = await request(app).get("/api/survey/99").send({ approved: true }).set("Authorization", `Bearer ${USER_TOKEN}`);

    expect(response.status).toBe(404);
    expect(response.text).toBe("Survey 99 doesn't exist or does not have any questions added to it!");
  });


});
