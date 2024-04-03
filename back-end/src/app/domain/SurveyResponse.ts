export class SurveyResponse {
  private readonly _userId: string;
  private readonly _question: string;
  private readonly _answer: string;    
  private readonly _note: string;

  public constructor(userId: string, question: string, answer: string, note?: string)
  public constructor(userId: string, question: string, answer: string, note: string) {
    this._userId = userId;
    this._question = question;
    this._answer = answer;
    this._note = note;
  }

  public get userId(): string {
    return this._userId;
  }

  public get question(): string {
    return this._question;
  }

  public get answer(): string {
    return this._answer;
  }

  public get note(): string {
    return this._note;
  }

}
  
