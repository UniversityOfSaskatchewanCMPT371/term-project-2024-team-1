import { SurveyQuestion } from "./SurveyQuestion";

export class Survey {
  private readonly _surveyId: number;
  private readonly _questions: SurveyQuestion[]; 
  private _dueDate: Date;

  public constructor(surveyId: number, questions: SurveyQuestion[], dueDate: Date) {
    this._surveyId = surveyId;
    this._questions = questions;
    this._dueDate = dueDate;
  }

  public get surveyId(): number {
    return this._surveyId;
  }

  public get questions(): SurveyQuestion[] {
    return this._questions;
  }

  public get dueDate(): Date {
    return this._dueDate;
  }

  public set dueDate(newDate: Date) {
    this._dueDate = newDate;
  }
}
