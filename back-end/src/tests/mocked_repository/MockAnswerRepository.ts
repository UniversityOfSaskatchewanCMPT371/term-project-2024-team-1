import { SurveyAnswer } from "@app/domain/SurveyAnswer";
import { ISurveyAnswerRepository } from "@app/domain/interfaces/repositories/ISurveyAnswerRepository";

export class MockAnswerRepository implements ISurveyAnswerRepository {
  private readonly _fakeDb: Map<string, SurveyAnswer>;
  private _returnId: number = 0;

  public constructor() {
    this._fakeDb = new Map();
  }

  getSurveyAnswers: (userId: string, surveyId: number) => Promise<SurveyAnswer[]>;

  getAnswers!: (userId: string) => Promise<SurveyAnswer[]>;
  get!: (answerID: number) => Promise<SurveyAnswer | null>;
  update!: (answers: SurveyAnswer[]) => Promise<boolean>;
  delete!: (answerId: number) => Promise<boolean>;

  async create(userId: string, answer: SurveyAnswer): Promise<number> {
    this._fakeDb.set(userId, answer);
    this._returnId++;
    return Promise.resolve(this._returnId);
  }
}
