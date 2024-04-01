import { SurveyAnswer } from "@app/domain/SurveyAnswer";

export interface ISurveyAnswerRepository {
  getSurveyAnswers: (userId: string, surveyId: number) => Promise<SurveyAnswer[]>;
  get: (answerID: number) => Promise<SurveyAnswer | null>;
  create: (userId: string, answer: SurveyAnswer) => Promise<number>;
  update: (answers: SurveyAnswer[]) => Promise<boolean>;
  delete: (answerId: number) => Promise<boolean>;
}
