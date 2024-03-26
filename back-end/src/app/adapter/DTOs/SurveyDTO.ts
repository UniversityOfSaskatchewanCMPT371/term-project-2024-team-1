export class SurveyDTO {
  public surveyName: string;
  public dateCreated: string;
  public id: number;
  public dueDate: string;
  
  public constructor(surveyName: string, dateCreated: string, id: number, dueDate: string) {
    this.surveyName = surveyName;
    this.dateCreated = dateCreated;
    this.id = id;
    this.dueDate = dueDate;
  }
}
