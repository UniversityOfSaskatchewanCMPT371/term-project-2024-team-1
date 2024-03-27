import { Survey } from "@app/domain/Survey";
// import { SurveyQuestion } from "@app/domain/SurveyQuestion";

export interface ISurveyRepository {
  getAll: () => Promise<Survey[]>;
  getSurvey: (surveyId: number) => Promise<Survey | null>;
  getSurveySubmittedUsers: (surveyId: number) => Promise<string[] | null>;
  addQuestionToSurvey: (surveyId: number, questionId: number, rankOrder: number) => Promise<boolean>; 
  createSurvey: (survey: Survey) => Promise<boolean>;
  deleteSurvey: (surveyId: number) => Promise<boolean>;
}
