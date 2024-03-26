export class SurveyAnswer {
  // private readonly _question: string;
  private readonly _id: number;
  private _answer: string;
  private readonly _questionId: number;
    
  public constructor(id: number, answer: string, questionId: number) {
    this._id = id;
    this._answer = answer;
    // this._question = question;
    this._questionId = questionId;
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

  // public get question(): string {
  //   return this._question;
  // }
}
