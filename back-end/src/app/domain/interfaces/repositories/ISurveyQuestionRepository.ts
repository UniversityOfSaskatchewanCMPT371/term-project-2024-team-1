import { SurveyQuestion } from "@app/domain/SurveyQuestion";

export interface ISurveyQuestionRepository {
  getAll: () => Promise<SurveyQuestion[]>;
  getBySurvey: (surveyName: string) => Promise<SurveyQuestion[]> | null;
  // getByQuestionId: (questionID: number) => Promise<SurveyQuestion | null>;
  create: (question: SurveyQuestion[]) => Promise<boolean>;
  // update: (question: SurveyQuestion) => Promise<boolean>;
  // delete: (questionId: number) => Promise<boolean>;
}
