import { ISurveyRepository } from "@app/domain/interfaces/repositories/ISurveyRepository";
import { Survey } from "@app/domain/Survey";

export class MockSurveyRepository implements ISurveyRepository {
  private readonly _fakeDb: Map<number, Survey>; 
  private readonly _fakeMapDb: Map<number, number>; 

  public constructor() {
    this._fakeDb = new Map();
    this._fakeMapDb = new Map();
  }

  async getAll(): Promise<Survey[]> {
    return Promise.resolve([...this._fakeDb.values()]);
  }

  async getSurvey(surveyId: number): Promise<Survey | null> {
    const survey: Survey | undefined = this._fakeDb.get(surveyId);
    if (survey === undefined) {
      return Promise.resolve(null);
    } else {
      return Promise.resolve(survey);
    }
  }

 
  public mapSurveyUser(userId: number, surveyId: number): void {
    this._fakeMapDb.set(userId, surveyId);
  }

  async getSurveySubmittedUsers(surveyId: number): Promise<string[] | null> {
    const userIds: string[] = [];
    this._fakeMapDb.forEach((value, key) => {
      if (value === surveyId) {
        userIds.push(key.toString());
      }
    });
    if (userIds.length === 0) {
      return userIds;
    }
    return userIds;
  }

  async createSurvey(survey: Survey): Promise<boolean> {
    const surveyId: number = survey.surveyId;
    this._fakeDb.set(surveyId, survey);
    return Promise.resolve(true);
  }

  async deleteSurvey(surveyId: number): Promise<boolean> {
    return Promise.resolve(this._fakeDb.delete(surveyId));
  }
}