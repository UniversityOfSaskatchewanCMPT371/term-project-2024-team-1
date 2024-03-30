import { QuestionToAddDTO } from "@app/adapter/DTOs/QuestionToAddDTO";
import { Survey } from "@app/domain/Survey";
// import { SurveyQuestion } from "@app/domain/SurveyQuestion";

export interface ISurveyRepository {
  getAll: () => Promise<Survey[]>;
  getSurvey: (surveyId: number) => Promise<Survey | null>;
  getUsersCompletedSurvey: (surveyId: number) => Promise<string[] | null>;
  getUsersNotCompletedSurvey: (surveyId: number) => Promise<string[] | null>;
  addQuestionToSurvey: (questionsToAdd: QuestionToAddDTO[]) => Promise<boolean>; 
  createSurvey: (survey: Survey) => Promise<boolean>;
  deleteSurvey: (surveyId: number) => Promise<boolean>;
}
