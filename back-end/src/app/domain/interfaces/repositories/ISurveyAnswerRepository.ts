import { SurveyAnswer } from "@app/domain/SurveyAnswer";
import { User } from "@app/domain/User";

export interface ISurveyAnswerRepository {
  getAll: (user: User) => Promise<SurveyAnswer[]>;
  getById: (answerID: number) => Promise<SurveyAnswer>;
  create: (answer: SurveyAnswer, user: User) => Promise<boolean>;
  update: (answer: SurveyAnswer) => Promise<boolean>;
  delete: (answerId: number) => Promise<boolean>;
}
