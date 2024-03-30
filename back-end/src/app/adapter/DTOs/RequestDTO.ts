export class RequestDTO {
  public id: number;
  public email: string;
  public clinicName: string;
  public status: string;
  public requestType: string;
  public creationDate: Date;
  public decisionDate: Date | null;

  public constructor(id: number, email: string, clinicName: string, status: string, requestType: string, creationDate: Date, decisionDate: Date | null) {
    this.id = id;
    this.email = email;
    this.clinicName = clinicName;
    this.status = status;
    this.requestType = requestType;
    this.creationDate = creationDate;
    this.decisionDate = decisionDate;
  }
}
