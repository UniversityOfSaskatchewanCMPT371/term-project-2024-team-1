import { SurveyAnswerService } from "@app/application/SurveyAnswerService";
import { nullOrUndefined } from "@app/application/util";
import { IRouteHandler } from "@app/domain/interfaces/IRouteHandler";
import log4jsConfig from "@resources/log4js-config.json";
import { Request, Response } from "express";
import { configure } from "log4js";
import { delay, inject, injectable } from "tsyringe";
import { LoggerFactory } from "@app/domain/factory/LoggerFactory";
// import jwt from "jsonwebtoken";
// import assert from "assert";
// import { ACCESS_TOKEN_SECRET } from "@resources/config";
import { ILogger } from "@app/domain/interfaces/ILogger";
import { SurveyAnswer } from "@app/domain/SurveyAnswer";
// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
configure(log4jsConfig);


// interface JwtPayload {
//   userId: string
// }

@injectable()
export class CreateAnswerHandler implements IRouteHandler<boolean> {
  
  //   private readonly _logger = getLogger(CreateAnswerHandler.name);
  private readonly _logger: ILogger = LoggerFactory.getLogger(CreateAnswerHandler.name);
  
  constructor(@inject(delay(() => SurveyAnswerService)) private readonly _surveyAnswerService: SurveyAnswerService) {

  }

  public handle(req: Request, res: Response): void {
    if (this.validation(req)) {
      this.execute(req)
        .then(success => {
          if (success) {
            this._logger.INFO(`Answer added successfully`);
            res.status(200).send(`Answer added successfully`);
          } else {
            this._logger.INFO(`Failed to add answer`);
            res.status(404).send(`Failed to add answer`);
          }
        }).catch(err => {
          this._logger.ERROR(`Failed to add answer, server error ${err}`);
          res.status(500).send("Failed to add answer, server error, please try again");
        });
    } else {
      this._logger.INFO("Failed to add, userId or answer wasn't provided");
      res.status(422).send("answer is required");
    }
  }

  public async execute(req: Request): Promise<boolean> {
    // const token: string[] = req.headers.authorization?.split(" ") ?? [];

    // const result: JwtPayload = jwt.verify(token[1], ACCESS_TOKEN_SECRET) as JwtPayload;
    // assert(!nullOrUndefined(result), "Result payload should not be null or undefined");
    // assert(!nullOrUndefined(result.userId), "UserId should not be null or undefined if we've successfully decrypted the payload");
    // const callerUserId: string = result.userId;

    const surveyAnswer: SurveyAnswer = req.body?.SurveyAnswer;
    if (surveyAnswer && typeof surveyAnswer.answer === "string" && typeof surveyAnswer.questionId === "number") {
      const answer: string = req.body.SurveyAnswer.answer;
      const questionId: number = req.body.SurveyAnswer.questionId;
      return this._surveyAnswerService.create("1", answer, questionId);
    }
    return false;
  }

  public validation(request: Request): boolean {
    return !nullOrUndefined(request.body) && !nullOrUndefined(request.params.surveyId) && !nullOrUndefined(request.body.SurveyAnswer);
  };

}
