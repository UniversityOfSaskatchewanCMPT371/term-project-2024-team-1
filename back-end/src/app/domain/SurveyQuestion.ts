export class SurveyQuestion {
  private readonly _id: number;
  private _parentId: number;
  private _question: string;
  private _standard: boolean;
  private _type: string;

  public constructor(id: number, question: string, standard: boolean, type: string, parentId?: number)
  public constructor(id: number, question: string, standard: boolean, type: string, parentId: number) {
    this._id = id;
    this._question = question;
    this._standard = standard;
    this._type = type;
    this._parentId = parentId ?? null;
  }

  public get id(): number {
    return this._id;
  }

  public get question(): string {
    return this._question;
  }

  public set question(newQuestion: string) {
    this._question = newQuestion;
  }

  public get standard(): boolean {
    return this._standard;
  }

  public set standard(isStandard: boolean) {
    this._standard = isStandard;
  }

  public get type(): string {
    return this._type;
  }

  public set type(newType: string) {
    this._type = newType;
  }

  public get parentId(): number {
    return this._parentId;
  }

  public set parentId(addParentById: number) {
    this._parentId = addParentById;
  }
}
