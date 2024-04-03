export class SurveyAnswer {
  private readonly _id: number;
  private readonly _questionId: number;
  private readonly _userId: string;
  private readonly _surveyId: number;
  private _answer: string;
  private _note: string;
    
  public constructor(userId: string, id: number, answer: string, questionId: number, surveyId: number, note?: string)
  public constructor(userId: string, id: number, answer: string, questionId: number, surveyId: number, note: string) {
    this._id = id;
    this._answer = answer;
    this._questionId = questionId;
    this._note = note ?? null;
    this._userId = userId;
    this._surveyId = surveyId;
  }
    
  public get id(): number {       
    return this._id;
  }

  public get answer(): string {
    return this._answer;
  }
      
  public set answer(newAnswer: string) {
    this._answer = newAnswer;
  }

  public get questionId(): number {
    return this._questionId;
  }
  
  public set note(newNote: string) {
    this._note = newNote;
  }

  public get note(): string {
    return this._note;
  }

  public get userId(): string {
    return this._userId;
  }

  public get surveyId(): number {
    return this._surveyId;
  }
}
