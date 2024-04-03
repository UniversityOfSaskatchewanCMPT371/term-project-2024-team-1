import { SurveyAnswerService } from "@app/application/SurveyAnswerService";
import { nullOrUndefined, AuthenticatedRequest } from "@app/application/util";
import { IRouteHandler } from "@app/domain/interfaces/IRouteHandler";
import { Request, Response } from "express";
import { injectable } from "tsyringe";
import { LoggerFactory } from "@app/domain/factory/LoggerFactory";
import { ILogger } from "@app/domain/interfaces/ILogger";
import { SurveyAnswer } from "@app/domain/SurveyAnswer";



@injectable()
export class CreateAnswerHandler implements IRouteHandler<number> {
  
  private readonly _logger: ILogger = LoggerFactory.getLogger(CreateAnswerHandler.name);
  
  constructor(private readonly _surveyAnswerService: SurveyAnswerService) {

  }

  public handle(req: Request, res: Response): void {
    req = req as AuthenticatedRequest;
    if (!this.validation(req, res)) {
      res.status(422).send(`Invalid request`);
      return;
    }
    this.execute(req)
      .then(id => {
        if (id) {
          this._logger.INFO(`Answer added successfully`);
          res.status(200).send({ answerId: id });
        } else {
          this._logger.INFO(`Failed to add answer`);
          res.status(500).send(`Failed to add answer`);
        }
      }).catch(err => {
        this._logger.ERROR(`Failed to add answer, server error ${err}`);
        res.status(500).send("Failed to add answer, server error, please try again");
      });
  }

  public async execute(...args: any[]): Promise<number> {
    const req: AuthenticatedRequest = args[0];
    const answer: SurveyAnswer = req.body;
    const userId: string = req.auth.userId;
    return this._surveyAnswerService.create(userId, answer);
  }

  public validation(...args: any[]): boolean {
    const res: Response = args[1];
    const req: AuthenticatedRequest = args[0];
    if (nullOrUndefined(req.body)) {
      return false;
    } else if (nullOrUndefined(req.auth)) {
      return false;
    } else if (nullOrUndefined(req.body.id) || req.body.id !== -1 || nullOrUndefined(req.body.questionId) || req.body.questionId < 0 || nullOrUndefined(req.body.userId) || nullOrUndefined(req.body.answer)) {
      return false;
    }
    const answer: SurveyAnswer = req.body;
    const userId: string = req.auth.userId;
    if (answer.userId !== userId) {
      this._logger.ERROR(`User ${userId} tried to change answers that belonged to another user`);
      res.status(403).send("Failed to update answer, you can only change your own answers!");
      return false;
    };
    return true;
  }

}
