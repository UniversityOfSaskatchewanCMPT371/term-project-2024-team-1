export class Survey {
  private _surveyName: string;
  private _dateCreated: string;

  public constructor(surveyName: string, dateCreated: string) {
    this._surveyName = surveyName;
    this._dateCreated = dateCreated;
  }

  public get surveyName(): string {
    return this._surveyName;
  }

  public set surveyName(newSurveyName: string) {
    this._surveyName = newSurveyName;
  }

  public get dateCreated(): string {
    return this._dateCreated;
  }

  public set dateCreated(newDateCreated: string) {
    this._dateCreated = newDateCreated;
  }
}
