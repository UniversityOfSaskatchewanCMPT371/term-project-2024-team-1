import { LoggerFactory } from "@app/domain/factory/LoggerFactory";
import { ILogger } from "@app/domain/interfaces/ILogger";
import { ISurveyAnswerRepository } from "@app/domain/interfaces/repositories/ISurveyAnswerRepository";
import { SurveyAnswer } from "@app/domain/SurveyAnswer";
import assert from "assert";
import { ResultSetHeader } from "mysql2";
import { constructBulkQuery, query } from "../SQLConfiguration";

export class AnswerSQLRepository implements ISurveyAnswerRepository {
  private readonly _logger: ILogger = LoggerFactory.getLogger(AnswerSQLRepository.name);

  private readonly _getSurveyAnswersQuery: string = `SELECT A.id, A.answer, A.questionId, A.userId, A.note, A.surveyId FROM Answer A
                                                        JOIN SurveyQuestionMap SQM ON SQM.questionId = A.questionId
                                                        JOIN Survey S ON S.id = SQM.surveyId AND S.id = A.surveyId
                                                        WHERE A.userId = ? AND S.id = ?`;

  private readonly _updateQuery: string = `UPDATE Answer SET answer=?, note=? WHERE id=? AND userId=?;`;
  private readonly _createQuery: string = "INSERT INTO Answer (answer, questionId, note, userId, surveyId) VALUES (?, ?, ?, ?, ?);";

  public async getSurveyAnswers(userId: string, surveyId: number): Promise<SurveyAnswer[]> {
    return query(this._getSurveyAnswersQuery, [userId, surveyId.toString()])
      .then((data: [SurveyAnswer[]]) => {
        const surveyAnswers: SurveyAnswer[] = data[0];
        return surveyAnswers;
      })
      .catch(err => {
        this._logger.ERROR(`Failed to fetch survey ${surveyId} answers for user ${userId}.\n Database error: ${err}`);
        throw Error(err as string);
      });
  }

  public async get(answerId: number): Promise<SurveyAnswer> {
    throw new Error("unimplemented");
  }

  async create(userId: string, answer: SurveyAnswer): Promise<number> {
    try {
      const result: ResultSetHeader[] = await query(this._createQuery,
        [answer.answer, answer.questionId.toString(), answer.note, userId, answer.surveyId.toString()]);
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
      .then((results: [ResultSetHeader[] | ResultSetHeader]) => {
        if (results[0].constructor !== Array) {
          const singleResult: ResultSetHeader = results[0] as ResultSetHeader;
          this._logger.INFO(`Successfully updated answer id ${answers[0].id} for user ${answers[0].userId}`);
          return singleResult.affectedRows > 0;
        }
        
        assert(results[0].constructor === Array);
        const resultSetHeaders: ResultSetHeader[] = results[0];
        const areAllAnswersAffected: boolean = resultSetHeaders
          .map(resultSetHeaders => resultSetHeaders.affectedRows > 0)
          .every(bool => bool); // this just means we're checking if EVERY bool in the array is true
        if (areAllAnswersAffected) {
          this._logger.INFO(`All answers were updated for user ${answers[0].userId}`);
        } else {
          this._logger.INFO(`Not all answers were updated for user ${answers[0].userId}.`);
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
