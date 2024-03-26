/* eslint-disable @typescript-eslint/naming-convention */
import { SurveyService } from "@app/application/SurveyService";
import { nullOrUndefined } from "@app/application/util";
import { LoggerFactory } from "@app/domain/factory/LoggerFactory";
import { ILogger } from "@app/domain/interfaces/ILogger";
import { IRouteHandler } from "@app/domain/interfaces/IRouteHandler";
import assert from "assert";
import { Request, Response } from "express";
import { injectable } from "tsyringe";

@injectable()
export class SurveyGetUserResponseHandler implements IRouteHandler<string[] | null> {
    handle(req: Request, res: Response): Promise<void> {
        throw new Error("Method not implemented.");
    }

    execute(req: Request): Promise<string[] | null> {
        throw new Error("Method not implemented.");
    }

    validation(...args: any[]): boolean {
        throw new Error("Method not implemented.");
    }
}