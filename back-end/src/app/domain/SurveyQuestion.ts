export class SurveyQuestion {
  private _question: string;
  private _standard: boolean;
  private _type: string;
  private _parentId: number;

  public constructor(question: string, standard: boolean, type: string, parentId?: number);
  public constructor(question: string, standard: boolean, type: string, parentId: number) {
    this._question = question;
    this._standard = standard;
    this._type = type;
    this._parentId = parentId ?? null;
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
