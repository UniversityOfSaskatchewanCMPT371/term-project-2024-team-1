import { Survey } from "@app/domain/Survey";
// import { SurveyQuestion } from "@app/domain/SurveyQuestion";

export interface ISurveyRepository {
  getAll: () => Promise<Survey[]>;
  getSurvey: (surveyName: string) => Promise<Survey | null>;
  createSurvey: (survey: Survey) => Promise<boolean>;
  deleteSurvey: (surveyName: string) => Promise<boolean>;
  // addQuestions: (surveyId: number, question: SurveyQuestion[]) => Promise<boolean>;
  // deleteQuestions: (surveyId: number, questionIds: number[]) => Promise<boolean>;
}
