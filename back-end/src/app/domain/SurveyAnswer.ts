export class SurveyAnswer {
  private readonly _questionId: number;
  private readonly _id: number;
  private _answer: string;
  private _note: string;
    
  public constructor(id: number, questionID: number, answer: string, note: string) {
    this._id = id;
    this._answer = answer;
    this._questionId = questionID;
    this._note = note;
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

  public get questionID(): number {
    return this._questionId;
  }

  public get note(): string {
    return this._note;
  }
    
  public set note(newNote: string) {
    this._note = newNote;
  }
}
