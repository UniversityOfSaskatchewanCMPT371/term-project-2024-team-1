import { SurveyAnswer } from "@app/domain/SurveyAnswer";

export interface ISurveyAnswerRepository {
  getAnswers: (userId: number) => Promise<SurveyAnswer[]>;
  get: (answerID: number) => Promise<SurveyAnswer | null>;
  create: (userId: number, answer: SurveyAnswer) => Promise<boolean>;
  update: (answer: SurveyAnswer) => Promise<boolean>;
  delete: (answerId: number) => Promise<boolean>;
}
