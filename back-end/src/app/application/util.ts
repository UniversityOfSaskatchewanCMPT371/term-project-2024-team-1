import { ACCESS_TOKEN_SECRET } from "@resources/config";
import assert from "assert";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserService } from "./UserService";
import { container } from "tsyringe";

interface JwtPayload {
  userId: string
}

export const ADMIN: string = "ADMIN";
export const USER: string = "USER";

export function nullOrUndefined(object: any): object is null | undefined {
  return object === null || object === undefined;
}

export function randomAlphanumString(length: number): string {
  const characters: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result: string = "";
  
  for (let i: number = 0; i < length; i += 1) {
    const randomIndex: number = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
}

export function authenticate(role: string) {
  return function(req: Request, res: Response, next: NextFunction) {
    const userService: UserService = container.resolve(UserService);
    
    const token: string[] = req.headers.authorization?.split(" ") ?? [];

    
    if (token.length === 0) {
      return res.status(401).send("No authorization found, please log in!");
      
    } else if (token[0] === "Bearer") {
      try {
        const result: JwtPayload = jwt.verify(token[1], ACCESS_TOKEN_SECRET) as JwtPayload;
        assert(!nullOrUndefined(result), "Result payload should not be null or undefined");
        assert(!nullOrUndefined(result.userId), "UserId should not be null or undefined if we've successfully decrypted the payload");
        const callerUserId: string = result.userId;
        
        userService.get(callerUserId).then(user => {
          if (nullOrUndefined(user)) {
            return res.status(404).send("UserID not found");
          } else {
            if (user.isAdmin) {
              next();
            } else if (role === USER) {
              next();
            } else {
              return res.status(403).send("Unauthorized access, you do not have permissions!");            
            }
          }
        }).catch(err => {
          console.log(err);
          return res.status(500).send("Server error, please try again");
        });

      } catch (e) {
        console.log(e);
        return res.status(401).send("Invalid authorization, please log in!");
      }
    } else {
      return res.status(401).send("No authorization token found, please login!");
    }
  };
}
