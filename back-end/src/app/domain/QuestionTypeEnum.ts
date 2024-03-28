export enum QuestionTypeEnum {
  TEXT = "TEXT",
  MULTIPLE_CHOICE = "MULTIPLE CHOICE",
  UNKNOWN = "UNKNOWN TYPE"
}

// export const QuestionTypeEnumValueToKey = {
//     "TEXT": QuestionTypeEnum.TEXT,
//     "MULTIPLE_CHOICE": QuestionTypeEnum.MULTIPLE_CHOICE
// };

export const questionTypeEnumValueToKey: Map<string, QuestionTypeEnum> = new Map<string, QuestionTypeEnum>([
  [QuestionTypeEnum.TEXT.toString(), QuestionTypeEnum.TEXT],
  [QuestionTypeEnum.MULTIPLE_CHOICE.toString(), QuestionTypeEnum.MULTIPLE_CHOICE]
]);
