export enum RequestTypeEnum {
  SIGNUP = "SIGNUP",
  PASSWORD_RESET = "PASSWORD_RESET"
}

export const requestTypeValueToKey: Map<string, RequestTypeEnum> = new Map<string, RequestTypeEnum>([
  [RequestTypeEnum.SIGNUP.toString(), RequestTypeEnum.SIGNUP],
  [RequestTypeEnum.PASSWORD_RESET.toString(), RequestTypeEnum.PASSWORD_RESET]
]);
