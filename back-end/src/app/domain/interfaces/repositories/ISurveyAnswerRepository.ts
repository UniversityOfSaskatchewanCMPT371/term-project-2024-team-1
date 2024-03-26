import { SurveyAnswer } from "@app/domain/SurveyAnswer";

export interface ISurveyAnswerRepository {
  getAnswers: (userId: string) => Promise<SurveyAnswer[] | null>;
  get: (answerID: number) => Promise<SurveyAnswer | null>;
  create: (userId: string, answer: string, questionId: number) => Promise<boolean>;
  update: (answer: SurveyAnswer) => Promise<boolean>;
  delete: (answerId: number) => Promise<boolean>;
}
