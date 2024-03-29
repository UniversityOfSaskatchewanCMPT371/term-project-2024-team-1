import { query } from "@app/adapter/SQLRepositories/SQLConfiguration";
import { SurveyQuestion } from "@app/domain/SurveyQuestion";
import "reflect-metadata";
import { getLogger } from "log4js";
import { ISurveyQuestionRepository } from "@app/domain/interfaces/repositories/ISurveyQuestionRepository";

export class QuestionSQLRepository implements ISurveyQuestionRepository {
  private readonly _logger = getLogger(QuestionSQLRepository.name);

  private readonly _getAllQuery: string = "SELECT * FROM Question";
  private readonly _getByQuestionIdQuery: string = "SELECT * FROM Question WHERE id = ?";
  private readonly _getBySurveyQuery: string = `SELECT Q.*, SQM.rankOrder FROM Question Q 
                                                  INNER JOIN SurveyQuestionMap SQM ON Q.id = SQM.questionId 
                                                  INNER JOIN Survey S ON SQM.surveyId = S.id 
                                                  WHERE S.id = ?`;

  private readonly _createQuestionQuery: string = "INSERT INTO Question (question, standard, type, parentId) VALUES (?, ?, ?, ?)";
  private readonly _updateQuestionQuery: string = "UPDATE Question SET question = ?, standard = ?, type = ?, parentId = ? WHERE id = ?";
  private readonly _deleteQuestionQuery: string = "DELETE FROM Question WHERE id = ?";

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

  async getBySurvey(surveyId: number): Promise<SurveyQuestion[]> {
    try {
      return query(this._getBySurveyQuery, [surveyId.toString()]).then((data: [SurveyQuestion[]]) => {
        const surveyQuestions: SurveyQuestion[] = data[0];
        if (surveyQuestions.length === 0) {
          return [];
        }
        return surveyQuestions;
      });
    } catch (error) {
      this._logger.error(`Failed to retrieve questions for survey ${surveyId}: `, error);
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

}
