
import { Request, Response } from "express";
export interface IRouteHandler<T> {
  handle: (req: Request, res: Response) => void;
  execute: (req: Request) => Promise<T>;
  validation: (...args: any[]) => boolean;
}
  
