export class Survey {
  private readonly _id: number;
  private _surveyName: string;
  private _dateCreated: Date;
  private _dueDate: Date;

  public constructor(id: number, surveyName: string, dueDate: Date, dateCreated?: Date)
  public constructor(id: number, surveyName: string, dueDate: Date, dateCreated: Date) {
    this._surveyName = surveyName;
    this._dateCreated = dateCreated ?? null;
    this._id = id;
    this._dueDate = dueDate;
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

  public get id(): number {
    return this._id;
  }

  public get dueDate(): Date {
    return this._dueDate;
  }


  public set dueDate(newDueDate: Date) {
    this._dueDate = newDueDate;
  }
}
