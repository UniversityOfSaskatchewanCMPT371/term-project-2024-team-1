export class SurveyQuestion {
  private _question: string;
  private _standard: boolean;
  private _type: string;
  private _parentId: number | null; // Updated to reflect possible null

  // Simplified to a single constructor signature for demonstration.
  // If parentId is not provided, it defaults to null.
  public constructor(question: string, standard: boolean, type: string, parentId?: number);
  public constructor(question: string, standard: boolean, type: string, parentId: number) {
    this._question = question;
    this._standard = standard;
    this._type = type;
    this._parentId = parentId ?? null; // If parentId is undefined, default to null
  }

  // Getter reflects that _parentId can be null
  public get parentId(): number | null {
    return this._parentId;
  }

  // Setter allows setting parentId, which could be improved to allow setting it to null explicitly if needed
  public set parentId(addParentById: number | null) {
    this._parentId = addParentById;
  }

  // Other getters and setters remain unchanged
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
}
