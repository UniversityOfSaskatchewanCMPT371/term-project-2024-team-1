/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/typedef */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import request from "supertest";
import app from "../../main";
import { query } from "@app/adapter/SQLRepositories/SQLConfiguration";
const {
  dropTables,
  createUserTable,
  createTables,
  createSurvey
} = require("./testSqlCommands");

const USER_TOKEN: string = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0MTIzNDUiLCJpYXQiOjE3MDk2NzIxODd9.MFSQJhBnwwB2rXGbUzmxycmUIdhMDFz4hhN4jBcJtFM";

describe("API Test for /api/survey", () => {

  const surveyData1: any = {
    surveyName: "Survey 1",
    dateCreated: "2024-03-27 12:00:00",
    dueDate: "2024-04-10 12:00:00"
  };

  beforeAll(async () => {
    await query(dropTables);
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

  it("should return an empty list since no surveys have been created", async () => {
    const response: any = await request(app).get("/api/survey").send({ approved: true }).set("Authorization", `Bearer ${USER_TOKEN}`);
    
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(0);
    expect(response.text).toBe("No users have completed the survey");
  });

  it("should succesfully retrieve one survey when one survey has been created", async () => {
    await query(createSurvey, [surveyData1.surveyName, surveyData1.dateCreated, surveyData1.dueDate]);

    const response: any = await request(app).get("/api/survey").send({ approved: true }).set("Authorization", `Bearer ${USER_TOKEN}`);
    
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body).toEqual([{ userId: 1 }]);
  });

  it("should succesfully retrieve multiple surveys when multiple surveys have been created", async () => {
    await query(createSurvey, [
      surveyData1.surveyName,
      surveyData1.dateCreated,
      surveyData1.dueDate
    ]);

    await query(createSurvey, ["Survey2", surveyData1.dateCreated, surveyData1.dueDate]);
    await query(createSurvey, ["Survey3", surveyData1.dateCreated, surveyData1.dueDate]);

    const response: any = await request(app).get("/api/survey").send({ approved: true }).set("Authorization", `Bearer ${USER_TOKEN}`);
    
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body).toEqual([{ userId: 1 }]);
  });

});
