export class User {
  id: number;
  userID: string;
  password: string;
  email: string;
  isAdmin: boolean;
  clinicID: number;

  constructor(id: number, userID: string, password: string, email: string, clinicID: number) {
    this.id = id;
    this.userID = userID;
    this.password = password;
    this.email = email;
    this.isAdmin = false;
    this.clinicID = clinicID;
      
    console.log("User ? is created", this);
  }
}
