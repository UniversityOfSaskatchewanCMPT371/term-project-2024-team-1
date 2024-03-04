import request from 'supertest';
import express, { Express } from 'express';
import 'reflect-metadata';

const app: Express = express();
app.use(express.json());

app.delete('/api/user/:userId', (req, res) => {
  if (req.params.userId === "test12345") {
    res.status(200).send({ message: "User deleted successfully." });
  } else {
    res.status(404).send({ error: "User not found." });
  }
});

describe('SMOKE TEST DELETE /api/user/:userId', () => {
  it('smoke test for /api/user/:userId to ensure service', async () => {
    const userId = "test12345";

    const response = await request(app)
      .delete(`/api/user/${userId}`);

    expect(response.statusCode).not.toBe(500);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message', 'User deleted successfully.');
  });
});
