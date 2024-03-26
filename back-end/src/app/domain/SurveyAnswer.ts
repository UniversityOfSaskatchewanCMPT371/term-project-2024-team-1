export class SurveyAnswer {
  private readonly _questionId: number;
  private readonly _id: number;
  private _answer: string;
  private _note: string;
    
  public constructor(id: number, answer: string, questionId: number, note?: string)
  public constructor(id: number, answer: string, questionId: number, note: string) {
    this._id = id;
    this._answer = answer;
    this._questionId = questionId;
    this._note = note ?? null;
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

  public get question(): number {
    return this._questionId;
  }
  
  public set note(newNote: string) {
    this._note = newNote;
  }

  public get note(): string {
    return this._note;
  }
}
