import { QuestionToAddDTO } from "@app/adapter/DTOs/QuestionToAddDTO";
import { ISurveyRepository } from "@app/domain/interfaces/repositories/ISurveyRepository";
import { Survey } from "@app/domain/Survey";
import { SurveyResponse } from "@app/domain/SurveyResponse";

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

  async getUsersCompletedSurvey(surveyId: number): Promise<string[] | null> {
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

  async getUsersNotCompletedSurvey(surveyId: number): Promise<string[] | null> { 
    return ["4", "5", "6"];
  }

  async createSurvey(survey: Survey): Promise<boolean> {
    const surveyId: number = survey.id;
    this._fakeDb.set(surveyId, survey);
    return Promise.resolve(true);
  }

  async deleteSurvey(surveyId: number): Promise<boolean> {
    return Promise.resolve(this._fakeDb.delete(surveyId));
  }

  async getAllResponses(surveyId: number): Promise<SurveyResponse[]> {
    return Promise.resolve([new SurveyResponse("fakeId", "fakeQuestion", "fakeAnswer")]);
  }

  async addQuestionToSurvey (questionsToAdd: QuestionToAddDTO[]): Promise<boolean> {
    return Promise.resolve(true);
  }; 
}
