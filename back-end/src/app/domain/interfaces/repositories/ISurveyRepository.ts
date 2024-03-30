import { Survey } from "@app/domain/Survey";
// import { SurveyQuestion } from "@app/domain/SurveyQuestion";

export interface ISurveyRepository {
  getAll: () => Promise<Survey[]>;
  getSurvey: (surveyId: number) => Promise<Survey | null>;
  getSurveySubmittedUsers: (surveyId: number) => Promise<string[] | null>;
  createSurvey: (survey: Survey) => Promise<boolean>;
  deleteSurvey: (surveyId: number) => Promise<boolean>;
  getAllResponses: (surveyId: number) => Promise<object[]>;
}
