export class SurveyQuestion {
    private _id: number;
    private _question: string;
    
    public constructor(question: string, id?: number);
    public constructor(question: string, id?: number) {
      this._id = id ?? -1;
      this._question = question;
    }
    
    public get id(): number {
      return this._id;
    }
    
    public set id(newID: number) {
      this._id = newID;
    }

    public get question(): string {
        return this._question;
      }
    
    public set question(newQuestion: string) {
        this._question = newQuestion;
      }
  }
    
  