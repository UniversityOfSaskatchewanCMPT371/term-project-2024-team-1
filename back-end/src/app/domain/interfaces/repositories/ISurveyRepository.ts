import { Survey } from "@app/domain/Survey";

export interface ISurveyRepository {
  getAll: () => Promise<Survey[]>;
  getSurvey: (surveyName: string) => Promise<Survey | null>;
  createSurvey: (survey: Survey) => Promise<boolean>;
  deleteSurvey: (surveyName: string) => Promise<boolean>;
  addQuestions: (surveyId: number, question: SurveyQuestion[]) => Promise<boolean>;
  deleteQuestions: (surveyId: number, questionIds: number[]) => Promise<boolean>;
}
