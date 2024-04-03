/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/consistent-type-assertions */
import "reflect-metadata";
import { query } from "@app/adapter/SQLRepositories/SQLConfiguration";
import { AnswerSQLRepository } from "@app/adapter/SQLRepositories/Survey/AnswerSQLRepository";
import { SurveyAnswer } from "@app/domain/SurveyAnswer";
import { Log4jsLogger } from "@app/adapter/Loggers/Log4jsLogger";
import { loggerToken } from "@app/adapter/DependencyInjections";
import { ILogger } from "@app/domain/interfaces/ILogger";
import { container } from "tsyringe";

jest.mock("@app/adapter/SQLRepositories/SQLConfiguration", () => ({
  query: jest.fn()
}));

describe("AnswerSQLRepository", () => {
  container.register<ILogger>(loggerToken, { useClass: Log4jsLogger });
  let repo: AnswerSQLRepository;

  interface CustomResultSetHeader {
    insertId: number;
    affectedRows: number;
    fieldCount: number;
    info: string;
    serverStatus: number;
    warningStatus: number;
    changedRows: number;
  }

  beforeEach(() => {
    repo = new AnswerSQLRepository();
    jest.clearAllMocks();
  });

  describe("create", () => {
    const surveyId: number = 1;
    const newAnswer: SurveyAnswer = new SurveyAnswer("testUserId", 0, "testAnswer", 1, surveyId);
    

    it("should return id on successful creation", async () => {
      const mockedResultSetHeader: CustomResultSetHeader = {
        insertId: 1,
        affectedRows: 0,
        fieldCount: 0,
        info: "",
        serverStatus: 0,
        warningStatus: 0,
        changedRows: 0
      };
      (query as jest.Mock).mockResolvedValueOnce([mockedResultSetHeader]);
      const result: number = await repo.create("testUserId", newAnswer);
      expect(result).toBe(1);
      expect(query).toHaveBeenCalledWith("INSERT INTO Answer (answer, questionId, note, userId, surveyId) VALUES (?, ?, ?, ?, ?);", ["testAnswer", "1", null, "testUserId", surveyId.toString()]);
    });

    it("should return NaN when creation fails", async () => {
      const mockedResultSetHeader: CustomResultSetHeader = {
        insertId: NaN,
        affectedRows: 0,
        fieldCount: 0,
        info: "",
        serverStatus: 0,
        warningStatus: 0,
        changedRows: 0
      };
      (query as jest.Mock).mockResolvedValueOnce([mockedResultSetHeader]);
      const result: number = await repo.create("testUserId", newAnswer);
      expect(result).toBe(NaN);
    });
  });
});
