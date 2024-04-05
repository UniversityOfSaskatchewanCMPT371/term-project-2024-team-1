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
  createUser
} = require("./testSqlCommands");

const USER_TOKEN: string = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0MTIzNDUiLCJpYXQiOjE3MDk2NzIxODd9.MFSQJhBnwwB2rXGbUzmxycmUIdhMDFz4hhN4jBcJtFM";

// This test suite runs directly on a database. Change "xdescribe" to "describe" then run it.
xdescribe("API Get Test for api/user", () => {

  beforeAll(async () => {
    await query(dropTables);
    await query(createUserTable);
    await query(createTables);

    const surveyData1: any = {
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

  it("should successfully connect to the User endpoint", async () => {
    const response: any = await request(app).get("/api/user").send({ approved: true }).set("Authorization", `Bearer ${USER_TOKEN}`);
    expect(response.status).toBe(200);
  });

  it("should return the admin user as it is the default user in the database", async () => {
    const response: any = await request(app).get("/api/user").send({ approved: true }).set("Authorization", `Bearer ${USER_TOKEN}`);
    
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body).toEqual([
      {
        isAdmin: 1,
        userId: "test12345"
      }
    ]);
  });

  it("should succesfully retrieve multiple users when multiple users has been created", async () => {
    await query(createUser, ["user1", "password1", "user1@example.com", "Clinic1", false]);
    await query(createUser, ["user2", "password2", "user2@example.com", "Clinic2", false]);
    await query(createUser, ["user3", "password3", "user3@example.com", "Clinic3", false]);

    const response: any = await request(app).get("/api/user").send({ approved: true }).set("Authorization", `Bearer ${USER_TOKEN}`);
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(4);
    expect(response.body).toEqual([
      { isAdmin: 1, userId: "test12345" }, { isAdmin: 0, userId: "user1" }, { isAdmin: 0, userId: "user2" }, { isAdmin: 0, userId: "user3" }]); 
  });

  it("should succesfully retrieve the righnt number of multiple users when a user have been deleted", async () => {
    await query("DELETE FROM User WHERE userId = ?", ["user2"]);

    const response: any = await request(app).get("/api/user").send({ approved: true }).set("Authorization", `Bearer ${USER_TOKEN}`);
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(3);
    expect(response.body).toEqual([
      { isAdmin: 1, userId: "test12345" }, { isAdmin: 0, userId: "user1" }, { isAdmin: 0, userId: "user3" }]); 
  });
    
});
