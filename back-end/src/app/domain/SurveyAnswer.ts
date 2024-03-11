export class SurveyAnswer {
    private _id: number;
    private _answer: string;
    private _questionID: number;
    private _note: string;
    
    public constructor(answer: string, questionID: number, note: string, id?: number);
    public constructor(answer: string, questionID: number, note: string, id?: number) {
      this._id = id ?? -1;
      this._answer = answer;
      this._questionID = questionID;
      this._note = note;
    }
    
    public get id(): number {
      return this._id;
    }
    
    public set id(newID: number) {
      this._id = newID;
    }

    public get answer(): string {
        return this._answer;
      }
      
    public set answer(newAnswer: string) {
        this._answer = newAnswer;
    }

    public get questionID(): number {
        return this._questionID;
      }
    
    public set questionID(newID: number) {
        this._questionID = newID;
      }

    public get note(): string {
        return this._note;
    }
    
    public set note(newNote: string) {
        this._note = newNote;
    }
  }
    
  