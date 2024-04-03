import { SurveyQuestion } from "@app/domain/SurveyQuestion";

export interface ISurveyQuestionRepository {
  getAll: () => Promise<SurveyQuestion[]>;
  getBySurvey: (surveyId: number) => Promise<SurveyQuestion[]>;
  // getByQuestionId: (questionID: number) => Promise<SurveyQuestion | null>;
  create: (question: SurveyQuestion[]) => Promise<boolean>;
  // update: (question: SurveyQuestion) => Promise<boolean>;
  // delete: (questionId: number) => Promise<boolean>;
}
