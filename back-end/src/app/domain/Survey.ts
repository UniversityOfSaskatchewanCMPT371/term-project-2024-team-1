export class Survey {
  private _surveyName: string;
  private _dateCreated: string;
  private _id: number;
  private _dueDate: string;

  public constructor(surveyName: string, dateCreated: string, id: number, dueDate: string) {
    this._surveyName = surveyName;
    this._dateCreated = dateCreated;
    this._id = id;
    this._dueDate = dueDate;
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

  public get id(): number {
    return this._id;
  }

  public set id(value: number) {
    this._id = value;
  }

  public get dueDate(): string {
    return this._dueDate;
  }

  public set dueDate(value: string) {
    this._dueDate = value;
  }
}
