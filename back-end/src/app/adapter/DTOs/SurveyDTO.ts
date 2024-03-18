export class SurveyDTO {
  public surveyName: string;
  public dateCreated: string;
  
  public constructor(surveyName: string, dateCreated: string) {
    this.surveyName = surveyName;
    this.dateCreated = dateCreated;
  }
}
