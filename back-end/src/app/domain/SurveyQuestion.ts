export class SurveyQuestion {
  private readonly _id: number;
  private _surveyId: number;
  private _question: string;
  private _standard: boolean;
  private _type: string;

  public constructor(id: number, surveyId: number, question: string, standard: boolean, type: string) {
    this._id = id;
    this._surveyId = surveyId;
    this._question = question;
    this._standard = standard;
    this._type = type;
  }

  public get id(): number {
    return this._id;
  }

  public get surveyId(): number {
    return this._surveyId;
  }

  public set surveyId(newSurveyId: number) {
    this._surveyId = newSurveyId;
  }

  public get question(): string {
    return this._question;
  }

  public set question(newQuestion: string) {
    this._question = newQuestion;
  }

  public get standard(): boolean {
    return this._standard;
  }

  public set standard(isStandard: boolean) {
    this._standard = isStandard;
  }

  public get type(): string {
    return this._type;
  }

  public set type(newType: string) {
    this._type = newType;
  }
}
