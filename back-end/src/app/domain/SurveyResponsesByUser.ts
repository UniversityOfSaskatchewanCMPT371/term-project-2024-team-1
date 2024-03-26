import { SurveyQuestion } from './SurveyQuestion';
import { SurveyAnswer } from './SurveyAnswer';

export class SurveyResponse {
    private readonly _surveyId: number;
    private readonly _userId: string;
    private _responses: Array<{question: SurveyQuestion, answer: SurveyAnswer}>;
  
    public constructor(surveyId: number, userId: string, responses: Array<{question: SurveyQuestion, answer: SurveyAnswer}>) {
      this._surveyId = surveyId;
      this._userId = userId;
      this._responses = responses;
    }
  
    public get surveyId(): number {
      return this._surveyId;
    }
  
    public get userId(): string {
      return this._userId;
    }
  
    public get responses(): Array<{question: SurveyQuestion, answer: SurveyAnswer}> {
      return this._responses;
    }
  
    public set responses(newResponses: Array<{question: SurveyQuestion, answer: SurveyAnswer}>) {
      this._responses = newResponses;
    }
  }
  