export class UserDTO {
  public userId: string;
  public isAdmin: boolean;

  public constructor(userId: string, isAdmin: boolean) {
    this.userId = userId;
    this.isAdmin = isAdmin;
  }
}
