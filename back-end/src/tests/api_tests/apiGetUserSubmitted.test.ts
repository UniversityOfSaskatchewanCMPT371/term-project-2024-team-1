/* eslint-disable @typescript-eslint/typedef */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import request from "supertest";
import app from "../../main";
import { query } from "@app/adapter/SQLRepositories/SQLConfiguration";

const USER_TOKEN: string = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0MTIzNDUiLCJpYXQiOjE3MDk2NzIxODd9.MFSQJhBnwwB2rXGbUzmxycmUIdhMDFz4hhN4jBcJtFM";

describe("API Test for /api/survey/:surveyId/user", () => {

  beforeAll(async () => {
    const surveyData1 = {
      surveyName: "Survey 1",
      dateCreated: "2024-03-27 12:00:00",
      dueDate: "2024-04-10 12:00:00"
    };
  
    await query("INSERT INTO Survey (surveyName, dateCreated, dueDate) VALUES (?, ?, ?)", [
      surveyData1.surveyName,
      surveyData1.dateCreated,
      surveyData1.dueDate
    ]);
  });

  it("should successfully connect to the API root endpoint", async () => {
    const response: any = await request(app).get("/");
    expect(response.status).toBe(200);
  });

  it("should successfully connect to the Survey root endpoint", async () => {
    const response: any = await request(app).get("/api/survey");
    expect(response.status).toBe(200);
  });

  it("should not retrieve any users when no user have completed a survey", async () => {
    const response: any = await request(app).get("/api/survey/1/user").send({ approved: true }).set("Authorization", `Bearer ${USER_TOKEN}`);
    
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(undefined);
    expect(response.text).toBe("No users have completed the survey");
  });

  it("should only retrieve one user when one user (not admin) have completed the survey", async () => {
    
    // insert values into database
    await query("INSERT INTO Question (question, standard, type) VALUES (?, ?, ?)", ["What is your name?", "1", "text"]);
    await query("INSERT INTO SurveyQuestionMap (surveyId, questionId, rankOrder) VALUES (?, ?, ?)", ["1", "1", "1"]);
    await query("INSERT INTO USER (userId, password, email, clinicName, isAdmin) VALUES (?, ?, ?, ?, ?)", ["1", "password123", "john@example.com", "ABCD Clinic", "0"]);
    await query("INSERT INTO SurveyCompletionMap (userId, surveyId) VALUES (?, ?)", ["1", "1"]);
    await query("INSERT INTO Answer (answer, questionId, userId, note) VALUES (?, ?, ?, ?)", ["Yes", "1", "1", "This is a note."]);
    await query("INSERT INTO ResponseOption (`option`, questionId) VALUES (?, ?)", ["Option 1", "1"]);

    const response: any = await request(app).get("/api/survey/1/user").send({ approved: true }).set("Authorization", `Bearer ${USER_TOKEN}`);
    
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body).toEqual([{ userId: "1" }]);

  });

  it("should retrieve multiple users when multiple users have completed the survey", async () => {
    
    // insert two more users
    await query("INSERT INTO USER (userId, password, email, clinicName, isAdmin) VALUES (?, ?, ?, ?, ?)", ["2", "password123", "a@example.com", "ABCD Clinic", "0"]);
    await query("INSERT INTO SurveyQuestionMap (surveyId, questionId, rankOrder) VALUES (?, ?, ?)", ["1", "1", "1"]);
    await query("INSERT INTO Answer (answer, questionId, userId, note) VALUES (?, ?, ?, ?)", ["Yes", "1", "2", "This is a note."]);
    await query("INSERT INTO ResponseOption (`option`, questionId) VALUES (?, ?)", ["Option 1", "1"]);
    await query("INSERT INTO SurveyCompletionMap (userId, surveyId) VALUES (?, ?)", ["2", "1"]);

    await query("INSERT INTO USER (userId, password, email, clinicName, isAdmin) VALUES (?, ?, ?, ?, ?)", ["3", "password123", "b@example.com", "ABCD Clinic", "0"]);
    await query("INSERT INTO SurveyQuestionMap (surveyId, questionId, rankOrder) VALUES (?, ?, ?)", ["1", "1", "1"]);
    await query("INSERT INTO Answer (answer, questionId, userId, note) VALUES (?, ?, ?, ?)", ["Yes", "1", "3", "This is a note."]);
    await query("INSERT INTO ResponseOption (`option`, questionId) VALUES (?, ?)", ["Option 1", "1"]);
    await query("INSERT INTO SurveyCompletionMap (userId, surveyId) VALUES (?, ?)", ["3", "1"]);

    const response: any = await request(app).get("/api/survey/1/user").send({ approved: true }).set("Authorization", `Bearer ${USER_TOKEN}`);

    expect(response.status).toBe(200);
    expect(response.text).toEqual("[{\"userId\":\"1\"},{\"userId\":\"2\"},{\"userId\":\"3\"}]");

  });

  it("should only retrieve the users who have completed the survey from a mixed list where both completed and not completed survey user exists", async () => {
    const response: any = await request(app).get("/api/survey/1/user").send({ approved: true }).set("Authorization", `Bearer ${USER_TOKEN}`);
    
    // insert users who did not complete survey
    await query("INSERT INTO USER (userId, password, email, clinicName, isAdmin) VALUES (?, ?, ?, ?, ?)", ["4", "password123", "c@example.com", "ABCD Clinic", "0"]);
    await query("INSERT INTO SurveyQuestionMap (surveyId, questionId, rankOrder) VALUES (?, ?, ?)", ["1", "1", "1"]);

    await query("INSERT INTO USER (userId, password, email, clinicName, isAdmin) VALUES (?, ?, ?, ?, ?)", ["5", "password123", "d@example.com", "ABCD Clinic", "0"]);
    await query("INSERT INTO SurveyQuestionMap (surveyId, questionId, rankOrder) VALUES (?, ?, ?)", ["1", "1", "1"]);

    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ userId: "1" }, { userId: "2" }, { userId: "3" }]);

  });

  it("should indicate that a survey does not exist for when the API is called on a nonexistent survey", async () => {
    const response: any = await request(app).get("/api/survey/100/user").send({ approved: true }).set("Authorization", `Bearer ${USER_TOKEN}`);
  
    expect(response.status).toBe(200);
    expect(response.text).toBe("The Survey does not exist.");
  });

});
