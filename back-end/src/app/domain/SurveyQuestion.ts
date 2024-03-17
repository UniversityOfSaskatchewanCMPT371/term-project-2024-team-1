import { SurveyAnswer } from "./SurveyAnswer";

export class SurveyQuestion {
  private readonly _id: number;
  private readonly _question: string;
  private readonly _answer: SurveyAnswer;
  private readonly _childQuestions: SurveyQuestion[];
    
  public constructor(id: number, question: string, childQuestions: SurveyQuestion[], answer?: SurveyAnswer);
  public constructor(id: number, question: string, childQuestions: SurveyQuestion[], answer: SurveyAnswer) {
    this._id = id;
    this._question = question;
    this._childQuestions = childQuestions;
    this._answer = answer ?? null;
  }
    
  public get id(): number {
    return this._id;
  }

  public get question(): string {
    return this._question;
  }

  public get childQuestions(): SurveyQuestion[] {
    return this._childQuestions;
  }

  public get answer(): SurveyAnswer {
    return this._answer;
  }
}
