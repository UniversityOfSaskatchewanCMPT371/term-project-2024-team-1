import { SurveyQuestion } from "@app/domain/SurveyQuestion";

export interface ISurveyQuestionRepository {
  getAll: () => Promise<SurveyQuestion[]>;
  getById: (questionID: number) => Promise<SurveyQuestion>;
  create: (question: SurveyQuestion) => Promise<boolean>;
  update: (question: SurveyQuestion) => Promise<boolean>;
  delete: (questionId: number) => Promise<boolean>;
}
