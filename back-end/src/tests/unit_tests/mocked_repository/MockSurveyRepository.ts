// import { ISurveyRepository } from "@app/domain/interfaces/repositories/ISurveyRepository";
// import { Survey } from "@app/domain/Survey";

// export class MockSurveyRepository implements ISurveyRepository {
//   private readonly surveys: Survey[] = [];

//   async getAll(): Promise<Survey[]> {
//     return this.surveys;
//   }

//   async getSurvey(surveyName: string): Promise<Survey | null> {
//     return this.surveys.find(s => s.surveyName === surveyName) || null;
//   }

//   async createSurvey(survey: Survey): Promise<boolean> {
//     this.surveys.push(survey);
//     return true;
//   }

//   async deleteSurvey(surveyName: string): Promise<boolean> {
//     const index = this.surveys.findIndex(s => s.surveyName === surveyName);
//     if (index !== -1) {
//       this.surveys.splice(index, 1);
//       return true;
//     }
//     return false;
//   }
// }
