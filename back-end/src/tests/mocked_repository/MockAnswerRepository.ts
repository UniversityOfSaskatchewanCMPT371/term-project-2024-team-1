import { ISurveyAnswerRepository } from "@app/domain/interfaces/repositories/ISurveyAnswerRepository";
import { SurveyAnswer } from "@app/domain/SurveyAnswer";

export class MockAnswerRepository implements ISurveyAnswerRepository {
  private readonly _fakeDb: Map<number, SurveyAnswer>;

  public constructor() {
    this._fakeDb = new Map();
  }

  async getSurveyAnswers(userId: string, surveyId: number): Promise<SurveyAnswer[]> {
    return [...this._fakeDb.values()].filter(answer => answer.userId === userId && answer.id === surveyId);
  }

  async get(answerId: number): Promise<SurveyAnswer | null> {
    return this._fakeDb.get(answerId) || null;
  }

  async create(userId: string, answer: SurveyAnswer): Promise<boolean> {
    if (userId && answer.id !== undefined) {
      this._fakeDb.set(answer.id, new SurveyAnswer(answer.userId, answer.id, answer.answer, answer.questionId, answer.note));
      return true;  
    }
    return false;
  }

  async update(answers: SurveyAnswer[]): Promise<boolean> {
    let allUpdated = true;
    answers.forEach(answer => {
      if (this._fakeDb.has(answer.id)) {
        this._fakeDb.set(answer.id, new SurveyAnswer(answer.userId, answer.id, answer.answer, answer.questionId, answer.note));
      } else {
        allUpdated = false;
      }
    });
    return allUpdated;
  }

  async delete(answerId: number): Promise<boolean> {
    return this._fakeDb.delete(answerId);
  }
}
