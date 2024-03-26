import { SurveyResponse } from "@app/domain/SurveyResponsesByUser";
import { SurveyQuestion } from "@app/domain/SurveyQuestion";
import { SurveyAnswer } from "@app/domain/SurveyAnswer";

export interface ISurveyResponseByUserRepository {

  getResponsesByUserForSurvey: (surveyId: number, userId: string) => Promise<SurveyResponse[] | null>;
  saveSurveyResponse: (surveyResponse: SurveyResponse) => Promise<boolean>;
  updateSurveyResponse: (surveyResponse: SurveyResponse) => Promise<boolean>;
  deleteResponsesByUserForSurvey: (surveyId: number, userId: string) => Promise<boolean>;
  getResponseByUserForQuestion: (surveyId: number, userId: string, questionId: number) => Promise<{ question: SurveyQuestion, answer: SurveyAnswer } | null>;
}
