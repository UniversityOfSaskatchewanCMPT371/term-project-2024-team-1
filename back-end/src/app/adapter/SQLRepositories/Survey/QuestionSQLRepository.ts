import { query } from "@app/adapter/SQLRepositories/SQLConfiguration";
import { SurveyQuestion } from "@app/domain/SurveyQuestion";
import "reflect-metadata";
import { getLogger } from "log4js";
import { ISurveyQuestionRepository } from "@app/domain/interfaces/repositories/ISurveyQuestionRepository";
// import { SurveyAnswer } from "@app/domain/SurveyAnswer";
// import { SurveyAnswer } from "@app/domain/SurveyAnswer";

export class QuestionSQLRepository implements ISurveyQuestionRepository {
  private readonly _logger = getLogger(QuestionSQLRepository.name);

  private readonly _getAllQuery: string = "SELECT * FROM Question";
  private readonly _getByQuestionIdQuery: string = "SELECT * FROM Question WHERE id = ?";
  private readonly _getBySurveyQuery: string = "SELECT Q.* FROM Question Q INNER JOIN SurveyQuestionMap SQM ON Q.id = SQM.questionId INNER JOIN Survey S ON SQM.surveyId = S.id WHERE S.surveyName = ?";
  private readonly _createQuestionQuery: string = "INSERT INTO Question (question, standard, type, parentId) VALUES (?, ?, ?, ?)";
  private readonly _updateQuestionQuery: string = "UPDATE Question SET question = ?, standard = ?, type = ?, parentId = ? WHERE id = ?";
  private readonly _deleteQuestionQuery: string = "DELETE FROM Question WHERE id = ?";
  private readonly _getQuestionsWithAnswersQuery: string = "??";

  // SELECT parentQuestion.*, parentAnswer.*, childQuestion.*, childAnswer.* FROM (Question AS parentQuestion LEFT JOIN Answer AS parentAnswer ON parentQuestion.id = parentAnswer.questionId) LEFT JOIN (Question AS childQuestion LEFT JOIN Answer As childAnswer ON childQuestion.id = childAnswer.questionId) ON parentQuestion.id = childQuestion.parentId WHERE parentQuestion.parentId IS NULL;


  // SELECT
  //   q.id AS question_id,
  //   q.question,
  //   q.parentId,
  //   q.standard,
  //   q.type,
  //   a.id AS answerId,
  //   a.answer,
  // FROM
  //   SurveyQuestionMap sqm
  // JOIN
  //   question q ON sqm.questionId = q.id
  // LEFT JOIN
  //   answer a ON q.id = a.questionId AND a.userId = 1
  // WHERE
  //   sqm.surveyId = 1
  // ORDER BY
  //   sqm.rank;

  //   private readonly _getQuestionsWithAnswersQuery: string = `
  // SELECT
  //   q.id AS question_id,
  //   q.question,
  //   q.parentId,
  //   q.standard,
  //   q.type,
  //   a.id AS answerId,
  //   a.answer,
  //   q.childQuestions
  // FROM
  //   SurveyQuestionMap sqm
  // JOIN
  //   question q ON sqm.questionId = q.id
  // LEFT JOIN
  //   answer a ON q.id = a.questionId AND a.userId = 1
  // WHERE
  //   sqm.surveyId = 1
  // ORDER BY
  //   sqm.rank;
  // `;

  // SELECT * FROM question q WHERE parentId = q.id

  async getAll(): Promise<SurveyQuestion[]> {
    try {
      return query(this._getAllQuery).then((data: [SurveyQuestion[]]) => {
        return data[0];
      });
    } catch (error) {
      this._logger.error("Failed to retrieve all questions: ", error);
      throw error;
    }
  }

  async getBySurvey(surveyName: string): Promise<SurveyQuestion[]> {
    try {
      return query(this._getBySurveyQuery, [surveyName]).then((data: any) => {
        if (data.length === 0) {
          return null;
        }
        return data.map((data: SurveyQuestion[]) => new SurveyQuestion(data[0].id, data[0].question, data[0].standard, data[0].type, data[0].parentId ?? undefined));
      });
    } catch (error) {
      this._logger.error(`Failed to retrieve questions for survey named ${surveyName}: `, error);
      throw error;
    }
  }

  async create(question: SurveyQuestion): Promise<boolean> {
    try {
      const isQuestionCreated: Promise<boolean> = query(this._createQuestionQuery,
        [question.question, (question.standard ? 1 : 0).toString(), question.type, question.parentId.toString()]);
      return isQuestionCreated;
    } catch (error) {
      this._logger.error(error);
      return Promise.reject(error);
    }
  }

  // async getQuestionsWithAnswers(surveyId: number, userId: number): Promise<{ question: SurveyQuestion, answer: SurveyAnswer | null }[]> {
  //   try {
  //     const data = await query(this._getQuestionsWithAnswersQuery, [userId.toString(), surveyId.toString()]);
  //     return data.map((row: any) => ({
  //       // answer: row.answerId ? new SurveyAnswer(row.answerId, row.answer, ) : null
  //       // childQuestion: row.childQuestion ? 
  //       // question: new SurveyQuestion(row.question_id, row.question, row.parentId, row.standard, row.type),
  //     }));
  //   } catch (error) {
  //     this._logger.error(`Failed to retrieve questions with answers for survey ${surveyId} and user ${userId}: `, error);
  //     throw error;
  //   }
  // }

}
