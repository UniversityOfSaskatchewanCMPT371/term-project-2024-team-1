import { SurveyAnswer } from "@app/domain/SurveyAnswer";

export interface ISurveyAnswerRepository {
  getAllByUserId: (userId: number) => Promise<SurveyAnswer[] | null>;
  getById: (answerID: number) => Promise<SurveyAnswer | null>;
  create: (userId: number, answer: SurveyAnswer) => Promise<boolean>;
  update: (answer: SurveyAnswer) => Promise<boolean>;
  delete: (answerId: number) => Promise<boolean>;
}
