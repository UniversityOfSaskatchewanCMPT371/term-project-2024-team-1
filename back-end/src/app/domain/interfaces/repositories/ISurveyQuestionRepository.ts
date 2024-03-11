import { SurveyQuestion } from "@app/domain/SurveyQuestion";

export interface ISurveyQuestionRepository {
  getAll: () => Promise<SurveyQuestion[]>;
  getByQuestionId: (questionID: number) => Promise<SurveyQuestion | null>;
  getBySurveyId: (surveyId: number) => Promise<SurveyQuestion[] | null>;
  create: (question: SurveyQuestion) => Promise<boolean>;
  update: (question: SurveyQuestion) => Promise<boolean>;
  delete: (questionId: number) => Promise<boolean>;
}
