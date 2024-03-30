export class QuestionToAddDTO {
  public surveyId: number;
  public questionId: number;
  public rankOrder: number;
    
  public constructor(surveyId: number, questionId: number, rankOrder: number) {
    this.surveyId = surveyId;
    this.questionId = questionId;
    this.rankOrder = rankOrder;
  }
}
  
