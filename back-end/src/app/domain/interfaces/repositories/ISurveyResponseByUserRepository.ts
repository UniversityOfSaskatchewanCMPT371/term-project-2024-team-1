import { Survey } from "@app/domain/Survey";

export interface ISurveyResponseByUserRepository {
    getResponsesByUserForSurvey: (surveyId: number, userId: string) => Promise<Survey[] | null>;
    saveUserResponse: (surveyId: number, userId: string, response: Survey) => Promise<boolean>;
    updateUserResponse: (surveyId: number, userId: string, response: Survey) => Promise<boolean>;
    deleteUserResponse: (surveyId: number, userId: string) => Promise<boolean>;
    getResponseByUserForQuestion: (surveyId: number, userId: string, questionId: number) => Promise<Survey | null>;
  }