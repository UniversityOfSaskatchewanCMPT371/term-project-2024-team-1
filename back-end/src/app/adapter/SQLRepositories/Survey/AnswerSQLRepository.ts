import { query } from "@app/adapter/SQLRepositories/SQLConfiguration";
import "reflect-metadata";
import { getLogger } from "log4js";
import { SurveyAnswer } from "@app/domain/SurveyAnswer";
import { ISurveyAnswerRepository } from "@app/domain/interfaces/repositories/ISurveyAnswerRepository";
import { ResultSetHeader } from "mysql2";


export class AnswerSQLRepository implements ISurveyAnswerRepository {
  private readonly _logger = getLogger(AnswerSQLRepository.name);

  private readonly _getAnswersQuery: string = "";
  private readonly _getAnswerById: string = "";
  private readonly _createQuery: string = "INSERT INTO Answer (answer, questionId, userId) VALUES (?, ?, ?)";
  private readonly _updateQuery: string = "UPDATE Answer SET answer = ? WHERE id = ?";
  private readonly _deleteQuery: string = "";    

  async getAnswers(userId: string): Promise<SurveyAnswer[] | null> {
    try {
      return query(this._getAnswersQuery, [userId]).then((data: [SurveyAnswer[]]) => {
        if (data[0].length === 0) {
          return null;
        }
        return data[0];
      });
    } catch (error) {
      this._logger.error("Failed to get all answers", error);
      throw error;
    }
  }

  async get(answerID: number): Promise<SurveyAnswer | null> {
    try {
      return query(this._getAnswerById, [answerID.toString()]).then((data: [SurveyAnswer[]]) => {
        if (data[0].length === 0) {
          return null;
        }
        return new SurveyAnswer(data[0][0].id, data[0][0].answer, data[0][0].questionId);
      });
    } catch (error) {
      this._logger.error(error);
      return Promise.reject(error);
    }
  }

  async create(userId: string, answer: string, questionId: number): Promise<boolean> {
    try {
      const isAnswerCreated: Promise<boolean> = query(this._createQuery,
        [answer, questionId.toString(), userId]);
      return isAnswerCreated;
    } catch (error) {
      this._logger.error(error);
      return Promise.reject(error);
    }
  }

  async update(answer: SurveyAnswer): Promise<boolean> {
    try {
      const updateUser: Promise<boolean> = query(this._updateQuery,
        [answer.answer, answer.id.toString()]);
      return updateUser;
    } catch (error) {
      this._logger.error(error);
      return Promise.reject(error);
    }
  }

  async delete(answerId: number): Promise<boolean> {
    try {
      return query(this._deleteQuery, [answerId.toString()])
        .then((fieldResults: ResultSetHeader[]) => {
          const fieldResult: ResultSetHeader = fieldResults[0];
          return fieldResult.affectedRows > 0;
        })
        .catch(err => {
          throw err;
        });
    } catch (error) {
      this._logger.error(error);
      return Promise.reject(error);
    }
  } 
}
