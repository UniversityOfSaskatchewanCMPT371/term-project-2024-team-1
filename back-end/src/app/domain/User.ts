export class User {
  private _clinicName: string;
  private _userId: string;
  private _password: string;
  private _email: string;
  private _agreedToEthics: boolean;
  private _isAdmin: boolean;
  
  public constructor(clinicName: string, userId: string, email: string, agreedToEthics: boolean, isAdmin: boolean, password?: string);
  public constructor(clinicName: string, userId: string, email: string, agreedToEthics: boolean, isAdmin: boolean, password: string) {

    this._clinicName = clinicName;
    this._userId = userId;
    this._password = password ?? null;
    this._email = email;
    this._agreedToEthics = agreedToEthics;
    this._isAdmin = isAdmin;
  }


  public get clinicName(): string {
    return this._clinicName;
  }
  
  public set clinicName(newClinicName: string) {
    this._clinicName = newClinicName;
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

  public get agreedToEthics(): boolean {
    return this._agreedToEthics;
  }
  
  public set agreedToEthics(newEthics: boolean) {
    this._agreedToEthics = newEthics;
  }
  
  public get isAdmin(): boolean {
    return this._isAdmin;
  }
  
  public set isAdmin(newIsAdmin: boolean) {
    this._isAdmin = newIsAdmin;
  }
}
