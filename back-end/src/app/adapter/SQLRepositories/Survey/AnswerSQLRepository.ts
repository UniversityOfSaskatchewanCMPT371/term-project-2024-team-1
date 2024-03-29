import { ISurveyAnswerRepository } from "@app/domain/interfaces/repositories/ISurveyAnswerRepository";
import { SurveyAnswer } from "@app/domain/SurveyAnswer";
import { constructBulkQuery, query } from "../SQLConfiguration";
import { ILogger } from "@app/domain/interfaces/ILogger";
import { LoggerFactory } from "@app/domain/factory/LoggerFactory";
import { ResultSetHeader } from "mysql2";
export class AnswerSQLRepository implements ISurveyAnswerRepository {
  private readonly _logger: ILogger = LoggerFactory.getLogger(AnswerSQLRepository.name);

  private readonly _updateQuery: string = `UPDATE Answer SET answer=?, note=? WHERE id=? AND userId=?;`;
  private readonly _createQuery: string = "INSERT INTO Answer (answer, questionId, note, userId) VALUES (?, ?, ?, ?);";

  public async getAnswers(userId: string): Promise<SurveyAnswer[]> {
    throw new Error("unimplemented");
  }

  public async get(answerId: number): Promise<SurveyAnswer> {
    throw new Error("unimplemented");
  }

  async create(userId: string, answer: SurveyAnswer): Promise<number> {
    try {
      const result: ResultSetHeader[] = await query(this._createQuery,
        [answer.answer, answer.questionId.toString(), answer.note, userId]);
      const resultSetHeaders: ResultSetHeader = result[0];
      return resultSetHeaders.insertId;
    } catch (error) {
      this._logger.ERROR(`Failed to add answers. \nError: ` + String(error));
      return Promise.reject(error);
    }
  }

  public async update(answers: SurveyAnswer[]): Promise<boolean> {

    const answerFields: string[][] = answers.map(answer => [answer.answer, answer.note, answer.id.toString(), answer.userId]);
    const bulkUpdateQuery: string = constructBulkQuery(this._updateQuery, answerFields);

    const updatedAnswers: Promise<boolean> = query(bulkUpdateQuery)
      .then((results: [ResultSetHeader[]]) => {
        const resultSetHeaders: ResultSetHeader[] = results[0];
        const areAllAnswersAffected: boolean = resultSetHeaders
          .map(resultSetHeaders => resultSetHeaders.affectedRows > 0)
          .every(bool => bool); // this just means we're checking if EVERY bool in the array is true
        if (areAllAnswersAffected) {
          this._logger.INFO(`All answers were updated`);
        } else {
          this._logger.INFO(`Not all answers were updated.`);
        }
        return areAllAnswersAffected;
      })
      .catch(e => {
        this._logger.ERROR(`Failed to update answers.\nError: ${e}`);
        throw e;
      });
    return updatedAnswers;
  }

  public async delete(answerId: number): Promise<boolean> {
    throw new Error("unimplemented");
  }


}
