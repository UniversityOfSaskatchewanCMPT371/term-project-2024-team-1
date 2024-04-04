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
  createQuestion
} = require("./testSqlCommands");

const USER_TOKEN: string = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0MTIzNDUiLCJpYXQiOjE3MDk2NzIxODd9.MFSQJhBnwwB2rXGbUzmxycmUIdhMDFz4hhN4jBcJtFM";

// This test suite runs directly on a database. Change "xdescribe" to "describe" then run it.
xdescribe("API Test for Get /api/survey/:surveyId", () => {

  const surveyData1: any = {
    surveyName: "Survey 1",
    dueDate: "2024-04-10 12:00:00"
  };

  const mockQuestionData: any = {
    parentId: null,
    question: "What is your favorite color?",
    standard: false,
    type: "Multiple Choice"
  };

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

  it("should succesfully retrieve the survey when one survey has been created with questions in it", async () => {
    await query(createSurvey, [surveyData1.surveyName, surveyData1.dueDate]);
    await query(createQuestion, [mockQuestionData.parentId, mockQuestionData.question, mockQuestionData.standard, mockQuestionData.type]);

    const response: any = await request(app).get("/api/survey/1").send({ approved: true }).set("Authorization", `Bearer ${USER_TOKEN}`);
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body.some((obj: Record<string, any>) =>
      obj.id === 1 &&
      obj.surveyName === "Survey 1" &&
      obj.dueDate === "2024-04-10 12:00:00"
    )).toBe(true);
      
  });


  it("should succesfully retrieve the first survey when multiple surveys exists", async () => {

    await query(createSurvey, ["Survey2", surveyData1.dateCreated, surveyData1.dueDate]);
    await query(createSurvey, ["Survey3", surveyData1.dateCreated, surveyData1.dueDate]);
    await query(createSurvey, ["Survey4", surveyData1.dateCreated, surveyData1.dueDate]);
    await query(createSurvey, ["Survey5", surveyData1.dateCreated, surveyData1.dueDate]);

    const response: any = await request(app).get("/api/survey/1").send({ approved: true }).set("Authorization", `Bearer ${USER_TOKEN}`);
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1); 
    expect(response.body.some((obj: Record<string, any>) =>
      obj.id === 1 &&
      obj.surveyName === "Survey 1" &&
      obj.dueDate === "2024-04-10 12:00:00"
    )).toBe(true);
  });

  it("should succesfully retrieve the last survey when multiple surveys exists", async () => {

    const response: any = await request(app).get("/api/survey/5").send({ approved: true }).set("Authorization", `Bearer ${USER_TOKEN}`);
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1); 
    expect(response.body.some((obj: Record<string, any>) =>
      obj.id === 1 &&
    obj.surveyName === "Survey 5" &&
    obj.dueDate === "2024-04-10 12:00:00"
    )).toBe(true);
  });

  it("should succesfully retrieve the middle survey when multiple surveys exists", async () => {

    const response: any = await request(app).get("/api/survey/5").send({ approved: true }).set("Authorization", `Bearer ${USER_TOKEN}`);
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1); 
    expect(response.body.some((obj: Record<string, any>) =>
      obj.id === 1 &&
    obj.surveyName === "Survey 3" &&
    obj.dueDate === "2024-04-10 12:00:00"
    )).toBe(true);
  });

  it("should return a 404 error when a surveyId that does not exist in the database is given", async () => {

    const response: any = await request(app).get("/api/survey/99").send({ approved: true }).set("Authorization", `Bearer ${USER_TOKEN}`);

    expect(response.status).toBe(404);
    expect(response.text).toBe("Survey 99 doesn't exist or does not have any questions added to it!");
  });


});
