export enum RequestStatusEnum {
  APPROVED = "APPROVED",
  AWAITING = "AWAITING",
  REJECTED = "REJECTED"
}

export const requestStatusValueToKey: Map<string, RequestStatusEnum> = new Map<string, RequestStatusEnum>([
  [RequestStatusEnum.APPROVED.toString(), RequestStatusEnum.APPROVED],
  [RequestStatusEnum.AWAITING.toString(), RequestStatusEnum.AWAITING],
  [RequestStatusEnum.REJECTED.toString(), RequestStatusEnum.REJECTED]
]);
