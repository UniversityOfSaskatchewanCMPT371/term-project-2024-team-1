import { query } from "@app/adapter/SQLRepositories/SQLConfiguration";
import { SurveyAnswer } from "@app/domain/SurveyAnswer";
import { AnswerSQLRepository } from "../../../app/adapter/SQLRepositories/Survey/AnswerSQLRepository";
/* eslint-disable */

jest.mock("@app/adapter/SQLRepositories/SQLConfiguration", () => ({
  query: jest.fn(),
}));

describe("AnswerSQLRepository", () => {
  let repo: AnswerSQLRepository;

  beforeEach(() => {
    repo = new AnswerSQLRepository();
    jest.clearAllMocks();
  });

  describe("getAllAnswersForSurvey", () => {
    const mockAnswers = [
      new SurveyAnswer("user1", 1, "Answer 1", 1),
      new SurveyAnswer("user2", 2, "Answer 2", 1)
    ];

    it("should return an array of SurveyAnswer objects for a given survey", async () => {
      (query as jest.Mock).mockResolvedValueOnce([mockAnswers]);
      const answers = await repo.getSurveyAnswers("user1",1);
      expect(answers).toEqual(mockAnswers);
      expect(query).toHaveBeenCalledWith("SELECT * FROM Answer WHERE surveyId = ?", ["1"]);
    });

    it("should handle and throw database errors", async () => {
      (query as jest.Mock).mockRejectedValueOnce(new Error("Database error"));
      await expect(repo.getSurveyAnswers("user1",1)).rejects.toThrow("Database error");
    });
  });

  describe("getAnswer", () => {
    const mockAnswer = new SurveyAnswer("user1", 1, "Answer 1", 1);

    it("should return a SurveyAnswer object when found", async () => {
      (query as jest.Mock).mockResolvedValueOnce([[mockAnswer], undefined]);
      const answer = await repo.get(1);
      expect(answer).toEqual(mockAnswer);
      expect(query).toHaveBeenCalledWith("SELECT * FROM Answer WHERE id = ?", ["1"]);
    });

    it("should return null when not found", async () => {
      (query as jest.Mock).mockResolvedValueOnce([[], undefined]);
      const answer = await repo.get(5);
      expect(answer).toBeNull();
    });
  });

  describe("createAnswer", () => {
    const newAnswer = new SurveyAnswer("user3", 3, "New Answer", 1);

    it("should return true on successful creation", async () => {
      (query as jest.Mock).mockResolvedValueOnce([{ affectedRows: 1 }, undefined]);
      const result = await repo.create("user3",newAnswer);
      expect(result).toBe(true);
      expect(query).toHaveBeenCalledWith("INSERT INTO Answer (userId, surveyId, answer) VALUES (?, ?, ?)", ["user3", "1", "New Answer"]);
    });

    it("should return false when creation fails", async () => {
      (query as jest.Mock).mockResolvedValueOnce([{ affectedRows: 0 }, undefined]);
      const result = await repo.create("user2",newAnswer);
      expect(result).toBe(false);
    });
  });

  describe("deleteAnswer", () => {
    it("should return true on successful deletion", async () => {
      (query as jest.Mock).mockResolvedValueOnce([{ affectedRows: 1 }, undefined]);
      const result = await repo.delete(1);
      expect(result).toBe(true);
      expect(query).toHaveBeenCalledWith("DELETE FROM Answer WHERE id = ?", ["1"]);
    });

    it("should return false when no rows are affected", async () => {
      (query as jest.Mock).mockResolvedValueOnce([{ affectedRows: 0 }, undefined]);
      const result = await repo.delete(5);
      expect(result).toBe(false);
    });
  });
});
