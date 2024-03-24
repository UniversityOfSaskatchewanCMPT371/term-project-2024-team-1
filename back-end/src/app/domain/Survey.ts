export class Survey {
  private readonly _surveyId: number;
  private _surveyName: string;
  private _dateCreated: Date;

  public constructor(surveyId: number, surveyName: string, dateCreated: Date) {
    this._surveyId = surveyId;
    this._surveyName = surveyName;
    this._dateCreated = dateCreated;
  }

  public get surveyId(): number {
    return this._surveyId;
  }
  
  public get surveyName(): string {
    return this._surveyName;
  }

  public set surveyName(newSurveyName: string) {
    this._surveyName = newSurveyName;
  }

  public get dateCreated(): Date {
    return this._dateCreated;
  }

  public set dateCreated(newDateCreated: Date) {
    this._dateCreated = newDateCreated;
  }
}
