import { Survey } from "@app/domain/Survey";
import { SurveyQuestion } from "@app/domain/SurveyQuestion";

export interface ISurveyRepository {
  getAll: () => Promise<number[]>;
  getSurvey: (surveyId: number) => Promise<Survey | null>;
  createSurvey: (additionalQuestions: SurveyQuestion[]) => Promise<boolean>;
  addQuestions: (surveyId: number, question: SurveyQuestion[]) => Promise<boolean>;
  deleteQuestions: (surveyId: number, questionIds: number[]) => Promise<boolean>;
}
