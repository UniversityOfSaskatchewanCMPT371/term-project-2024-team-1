import { query } from "@app/adapter/SQLRepositories/SQLConfiguration";
import { Survey } from "@app/domain/Survey";
import { SurveySQLRepository } from "../../../app/adapter/SQLRepositories/Survey/SurveySQLRespository";
import { formatDateForSQL } from "@app/application/util";
import { SurveyResponse } from "@app/domain/SurveyResponse";
import { loggerToken } from "@app/adapter/DependencyInjections";
import { ILogger } from "@app/domain/interfaces/ILogger";
import { container } from "tsyringe";
import { ISurveyRepository } from "@app/domain/interfaces/repositories/ISurveyRepository";
import { Log4jsLogger } from "@app/adapter/Loggers/Log4jsLogger";
/* eslint-disable */

jest.mock("@app/adapter/SQLRepositories/SQLConfiguration", () => ({
  query: jest.fn()
}));

describe("SurveySQLRepository", () => {
  let repo: ISurveyRepository;
  container.register<ILogger>(loggerToken, { useClass: Log4jsLogger });

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
      expect(query).toHaveBeenCalledWith("SELECT * FROM Survey;");
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
      expect(query).toHaveBeenCalledWith("SELECT * FROM Survey WHERE id = ?;", ["1"]);
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
      expect(query).toHaveBeenCalledWith("INSERT INTO Survey (surveyName, dateCreated, dueDate) VALUES (?, NOW(), ?);", ["New Survey", formatDateForSQL(newSurvey.dueDate)]);
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
      expect(query).toHaveBeenCalledWith("DELETE FROM Survey WHERE id = ?;", ["1"]);
    });

    it("should return false when no rows are affected", async () => {
      (query as jest.Mock).mockResolvedValueOnce([{ affectedRows: 0 }, undefined]);
      const result = await repo.deleteSurvey(5);
      expect(result).toBe(false);
    });
  });

  describe("getAllResponse", () => {
    const mockSurveyResponses = [
      new SurveyResponse("fakeUserId1", "fakeQuestion1", "fakeAnswer1"),
      new SurveyResponse("fakeUserId1", "fakeQuestion1", "fakeAnswer1")
    ];

    it("should return an array of Survey Response objects", async () => {
      (query as jest.Mock).mockResolvedValueOnce([[mockSurveyResponses], []]);
      const responses = await repo.getAllResponses(1);
      expect(responses).toEqual([mockSurveyResponses]);27
      expect(query).toHaveBeenCalledWith(`  SELECT Q.question AS question, A.answer AS answer, A.userId AS userId , A.note AS note 
                                                      FROM 
                                                          Question AS Q
                                                      INNER JOIN 
                                                          Answer AS A ON Q.id = A.questionId
                                                      INNER JOIN 
                                                          SurveyQuestionMap AS SQM ON Q.id = SQM.questionId
                                                      WHERE 
                                                          SQM.surveyId = ?
                                                      ORDER BY 
                                                          userId,
                                                          CASE
                                                              WHEN Q.parentId IS NULL THEN SQM.rankOrder
                                                              ELSE (SELECT rankOrder FROM SurveyQuestionMap WHERE questionId = Q.parentId)
                                                          END,
                                                          CASE
                                                              WHEN Q.parentId IS NULL THEN 0
                                                              ELSE 1
                                                          END,
                                                          SQM.rankOrder;`, ["1"]);
    });

    it("should handle and throw database errors", async () => {
      (query as jest.Mock).mockRejectedValueOnce(new Error("Database error"));
      await expect(repo.getAllResponses(1)).rejects.toThrow("Database error");
    });
  });
});
