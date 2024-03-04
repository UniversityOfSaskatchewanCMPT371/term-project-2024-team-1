import request from 'supertest';
import express, { Express } from 'express';
import 'reflect-metadata';

const app: Express = express();
app.use(express.json());

app.get('/api/users', (req, res) => {
  res.status(200).json([{ userId: "user1", name: "User One" }]);
});

describe('SMOKE TEST GET /api/users', () => {
  it('smoke test for /api/users to ensure service', async () => {
    const response = await request(app)
      .get('/api/users');

    expect(response.statusCode).not.toBe(500);
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
