export class User {
  private _userId: string;
  private _password: string;
  private _email: string;
  private _isAdmin: boolean;
  
  public constructor(userId: string, email: string, isAdmin: boolean, password?: string);
  public constructor(userId: string, email: string, isAdmin: boolean, password: string) {

    this._userId = userId;
    this._password = password ?? null;
    this._email = email;
    this._isAdmin = isAdmin;
  }


  
  public get userId(): string {
    return this._userId;
  }
  
  public set userId(newUserID: string) {
    this._userId = newUserID;
  }
  
  public get password(): string {
    return this._password;
  }
  
  public set password(newPassword: string) {
    this._password = newPassword;
  }
  
  public get email(): string {
    return this._email;
  }
  
  public set email(newEmail: string) {
    this._email = newEmail;
  }
  
  public get isAdmin(): boolean {
    return this._isAdmin;
  }
  
  public set isAdmin(newIsAdmin: boolean) {
    this._isAdmin = newIsAdmin;
  }
}
  
