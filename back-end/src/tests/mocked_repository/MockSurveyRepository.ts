import { Survey } from "@app/domain/Survey";
import { ISurveyRepository } from "@app/domain/interfaces/repositories/ISurveyRepository";

export class MockSurveyRepository implements ISurveyRepository {
  private readonly _fakeDb: Map<string, Survey>;
  private readonly _questionMap: Map<number, Array<{ surveyId: number, questionId: number, rankOrder: number }>>;

  public constructor() {
    this._fakeDb = new Map();
    this._questionMap = new Map();
  }

  async getAll(): Promise<Survey[]> {
    return Promise.resolve([...this._fakeDb.values()]);
  }

  async getSurvey(surveyName: string): Promise<Survey | null> {
    // eslint-disable-next-line @typescript-eslint/typedef
    const survey = [...this._fakeDb.values()].find(survey => survey.surveyName === surveyName);
    return Promise.resolve(survey ?? null);
  }

  async createSurvey(survey: Survey): Promise<boolean> {
    if (this._fakeDb.has(survey.surveyName)) {
      return Promise.resolve(false); // Simulate unique constraint on surveyName
    }
    this._fakeDb.set(survey.surveyName, survey);
    return Promise.resolve(true);
  }

  async addQuestionToSurvey(surveyId: number, questionId: number, rankOrder: number): Promise<boolean> {
    // eslint-disable-next-line @typescript-eslint/typedef
    const questionsForSurvey = this._questionMap.get(surveyId) ?? [];
    questionsForSurvey.push({ surveyId, questionId, rankOrder });
    this._questionMap.set(surveyId, questionsForSurvey);
    return Promise.resolve(true);
  }

  async deleteSurvey(surveyName: string): Promise<boolean> {
    return Promise.resolve(this._fakeDb.delete(surveyName));
  }
}
