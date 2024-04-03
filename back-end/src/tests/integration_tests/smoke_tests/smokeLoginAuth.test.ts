import request from "supertest";
import express, { Express } from "express";
import "reflect-metadata";
/* eslint-disable @typescript-eslint/typedef */

const app: Express = express();
app.use(express.json());

app.post("/api/login", (req, res) => {
  if (req.body.userId && req.body.password) {
    res.status(200).json({ accessToken: "mock_access_token" });
  } else {
    res.status(400).json({ error: "Missing userId or password" });
  }
});

describe("SMOKE TEST POST /api/login", () => {
  it("smoke test for /api/login to ensure service", async () => {
    const loginData = {
      userId: "test12345",
      password: "smkfomg452AM$"
    };

    const response = await request(app)
      .post("/api/login")
      .send(loginData);

    expect(response.statusCode).not.toBe(500);
    expect(response.statusCode).toBe(200);
    
  });
});
