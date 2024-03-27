import { query } from "@app/adapter/SQLRepositories/SQLConfiguration";
import { Survey } from "@app/domain/Survey";
import { SurveySQLRepository } from "../../../app/adapter/SQLRepositories/Survey/SurveySQLRespository";
import { formatDateForSQL } from "@app/application/util";
/* eslint-disable */

jest.mock("@app/adapter/SQLRepositories/SQLConfiguration", () => ({
  query: jest.fn(),
}));

describe("SurveySQLRepository", () => {
  let repo: SurveySQLRepository;

  beforeEach(() => {
    repo = new SurveySQLRepository();
    jest.clearAllMocks();
  });

  describe("getAll", () => {
    const mockSurveys = [
      new Survey(1, "Survey 1", new Date(), new Date()),
      new Survey(2, "Survey 2", new Date(), new Date())
    ];

    it("should return an array of Survey objects", async () => {
      (query as jest.Mock).mockResolvedValueOnce([mockSurveys]);
      const surveys = await repo.getAll();
      expect(surveys).toEqual(mockSurveys);
      expect(query).toHaveBeenCalledWith("SELECT * FROM Survey");
    });

    it("should handle and throw database errors", async () => {
      (query as jest.Mock).mockRejectedValueOnce(new Error("Database error"));
      await expect(repo.getAll()).rejects.toThrow("Database error");
    });
  });

  describe("getSurvey", () => {
    const mockSurvey = new Survey(1, "Survey 1", new Date(), new Date());

    it("should return a Survey object when found", async () => {
      (query as jest.Mock).mockResolvedValueOnce([[mockSurvey], undefined]);
      const survey = await repo.getSurvey(1);
      expect(survey).toEqual(mockSurvey);
      expect(query).toHaveBeenCalledWith("SELECT * FROM Survey WHERE id = ?", ["1"]);
    });

    it("should return null when not found", async () => {
      (query as jest.Mock).mockResolvedValueOnce([[], undefined]);
      const survey = await repo.getSurvey(5);
      expect(survey).toBeNull();
    });
  });

  describe("createSurvey", () => {
    const newSurvey = new Survey(3, "New Survey", new Date(), new Date());

    it("should return true on successful creation", async () => {
      (query as jest.Mock).mockResolvedValueOnce([{ affectedRows: 1 }, undefined]);
      const result = await repo.createSurvey(newSurvey);
      const dueDate: string = formatDateForSQL(new Date());
      expect(result).toBe(true);
      expect(query).toHaveBeenCalledWith("INSERT INTO Survey (surveyName, dateCreated, dueDate) VALUES (?, NOW(), ?)", ["New Survey", dueDate]);
    });

    it("should return false when creation fails", async () => {
      (query as jest.Mock).mockResolvedValueOnce([{ affectedRows: 0 }, undefined]);
      const result = await repo.createSurvey(newSurvey);
      expect(result).toBe(false);
    });
  });

  describe("deleteSurvey", () => {
    it("should return true on successful deletion", async () => {
      (query as jest.Mock).mockResolvedValueOnce([{ affectedRows: 1 }, undefined]);
      const result = await repo.deleteSurvey(1);
      expect(result).toBe(true);
      expect(query).toHaveBeenCalledWith("DELETE FROM Survey WHERE id = ?", ["1"]);
    });

    it("should return false when no rows are affected", async () => {
      (query as jest.Mock).mockResolvedValueOnce([{ affectedRows: 0 }, undefined]);
      const result = await repo.deleteSurvey(5);
      expect(result).toBe(false);
    });
  });
});
