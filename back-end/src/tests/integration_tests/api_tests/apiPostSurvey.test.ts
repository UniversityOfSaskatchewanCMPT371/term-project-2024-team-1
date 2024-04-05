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
  dropUserTable
} = require("./testSqlCommands");

const USER_TOKEN: string = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0MTIzNDUiLCJpYXQiOjE3MDk2NzIxODd9.MFSQJhBnwwB2rXGbUzmxycmUIdhMDFz4hhN4jBcJtFM";

// This test suite runs directly on a database. Change "xdescribe" to "describe" then run it.
// PreCondition: the Get Method for this API endpoint should work
xdescribe("API Test for Post /api/survey", () => {

  const surveyData1: any = {
    surveyName: "Survey Correct",
    dateCreated: "2024-03-27 12:00:00",
    dueDate: "2024-04-10 12:00:00"
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

  it("should return a 401 error when a non-user is trying to call it", async () => {
    const response: any = await request(app).post("/api/survey").send({ approved: true });
    expect(response.status).toBe(401);
  });

  it("should return a 422 status when trying to call the post on the root endpoint with no inputs", async () => {
    const response: any = await request(app).post("/api/survey").send({ approved: true }).set("Authorization", `Bearer ${USER_TOKEN}`);
    expect(response.status).toBe(422);
  });

  it("should return a 422 status when trying to create a survey with no Survey Name", async () => {
    const surveyData = {
      dateCreated: "2024-03-27T12:00:00.000Z",
      dueDate: "2024-04-10T12:00:00.000Z"
    };
    const response: any = await request(app).post("/api/survey").send(surveyData).set("Authorization", `Bearer ${USER_TOKEN}`);
    expect(response.status).toBe(422);
    expect(response.text).toBe("Incorrect survey format, please try again!");
  });

  it("should return a 422 status when trying to create a survey with no due date", async () => {
    const surveyData = {
      surveyName: "Survey 1",
      dateCreated: "2024-03-27T12:00:00.000Z"
    };
    const response: any = await request(app).post("/api/survey").send(surveyData).set("Authorization", `Bearer ${USER_TOKEN}`);
    expect(response.status).toBe(422);
    expect(response.text).toBe("Incorrect survey format, please try again!");
  });

  it("should return a 201 status when trying to create a survey with no date created since the system should automatically create this", async () => {
    const surveyData = {
      surveyName: "Survey 1", 
      dueDate: "2024-04-10T12:00:00.000Z"
    };
    const response: any = await request(app).post("/api/survey").send(surveyData).set("Authorization", `Bearer ${USER_TOKEN}`);
    expect(response.status).toBe(201);
    expect(response.text).toBe("Successfully created survey");

    // call on get method to ensure the survey has been created with matching inputs
    const getResponse: any = await request(app).get("/api/survey").send({ approved: true }).set("Authorization", `Bearer ${USER_TOKEN}`);
    expect(getResponse.status).toBe(200);
    expect(getResponse.body).toHaveLength(1);
    expect(getResponse.body.some((obj: Record<string, any>) =>
      obj.id === 1 &&
      obj.surveyName === "Survey 1" &&
      obj.dueDate === "2024-04-10T18:00:00.000Z"
    )).toBe(true);
      
  });

  it("should succesfully create survey in the database when all inputs are given", async () => {

    const response: any = await request(app).post("/api/survey").send(surveyData1).set("Authorization", `Bearer ${USER_TOKEN}`);
    
    expect(response.status).toBe(201);
    expect(response.text).toBe("Successfully created survey");
    
    // call on get method to ensure the survey has been created with matching inputs
    const getResponse: any = await request(app).get("/api/survey").send({ approved: true }).set("Authorization", `Bearer ${USER_TOKEN}`);
    expect(getResponse.status).toBe(200);
    expect(getResponse.body).toHaveLength(2);
    console.log(getResponse.body);
    expect(getResponse.body.some((obj: Record<string, any>) =>
      obj.surveyName === "Survey Correct" &&
      obj.dueDate === "2024-04-11T00:00:00.000Z"
    )).toBe(true);


  });

  it("should return a 422 status when trying to create a survey with only spaces as Survey Name Inputs", async () => {
    const surveyData = {
      surveyName: " ",
      dueDate: "2024-04-10T12:00:00.000Z"
    };
    const response: any = await request(app).post("/api/survey").send(surveyData).set("Authorization", `Bearer ${USER_TOKEN}`);
    expect(response.status).toBe(422);
    expect(response.text).toBe("Incorrect survey format, please try again!");
  });

  it("should return a 422 status when trying to create a survey with non-date formatted inputs", async () => {
    const surveyData = {
      surveyName: " ",
      dueDate: "Timeee"
    };
    const response: any = await request(app).post("/api/survey").send(surveyData).set("Authorization", `Bearer ${USER_TOKEN}`);
    expect(response.status).toBe(422);
    expect(response.text).toBe("Incorrect survey format, please try again!");
  });

  it("should return a 422 status when trying to create a survey with due date that has already passed", async () => {
    const surveyData = {
      surveyName: " ",
      dueDate: "2023-04-10T12:00:00.000Z"
    };
    const response: any = await request(app).post("/api/survey").send(surveyData).set("Authorization", `Bearer ${USER_TOKEN}`);
    expect(response.status).toBe(422);
    expect(response.text).toBe("Incorrect survey format, please try again!");
  });

});
