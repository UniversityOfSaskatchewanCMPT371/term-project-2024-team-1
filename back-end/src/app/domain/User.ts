export class User {
  private _userID: string;
  private _password: string;
  private _email: string;
  private _isAdmin: boolean;
  private _clinicID: number;
  
  public constructor(userID: string, email: string, clinicID: number, isAdmin: boolean, password?: string);
  public constructor(userID: string, email: string, clinicID: number, isAdmin: boolean, password: string) {

    this._userID = userID;
    this._password = password ?? null;
    this._email = email;
    this._isAdmin = isAdmin;
    this._clinicID = clinicID;
  }


  
  public get userID(): string {
    return this._userID;
  }
  
  public set userID(newUserID: string) {
    this._userID = newUserID;
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
  
  public get clinicID(): number {
    return this._clinicID;
  }
  
  public set clinicID(newClinicID: number) {
    this._clinicID = newClinicID;
  }
  
  
}
  
