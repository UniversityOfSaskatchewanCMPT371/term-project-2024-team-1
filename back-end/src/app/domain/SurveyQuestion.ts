import { QuestionTypeEnum } from "./QuestionTypeEnum";
import { SurveyAnswer } from "./SurveyAnswer";

export class SurveyQuestion {
  private readonly _id: number;
  private _parentId: number;
  private _question: string;
  private _standard: boolean;
  private _type: QuestionTypeEnum;
  private _answer: SurveyAnswer;
  private _rankOrder: number;

  public constructor(id: number, question: string, standard: boolean, type: QuestionTypeEnum, rankOrder: number, parentId?: number, answer?: SurveyAnswer)
  public constructor(id: number, question: string, standard: boolean, type: QuestionTypeEnum, rankOrder: number, parentId: number, answer: SurveyAnswer) {
    this._id = id;
    this._question = question;
    this._standard = standard;
    this._type = type;
    this._parentId = parentId ?? null;
    this._answer = answer ?? null;
    this._rankOrder = rankOrder;
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

  public get type(): QuestionTypeEnum {
    return this._type;
  }

  public set type(newType: QuestionTypeEnum) {
    this._type = newType;
  }

  public get parentId(): number {
    return this._parentId;
  }

  public set parentId(addParentById: number) {
    this._parentId = addParentById;
  }

  public get answer(): SurveyAnswer {
    return this._answer;
  }

  public set answer(newAnswer: SurveyAnswer) {
    this._answer = newAnswer;
  }

  public get rankOrder(): number {
    return this._rankOrder;
  }

  public set rankOrder(newRankOrder: number) {
    this._rankOrder = newRankOrder;
  }
}
