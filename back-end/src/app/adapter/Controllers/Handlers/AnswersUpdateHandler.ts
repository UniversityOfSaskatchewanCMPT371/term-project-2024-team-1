import { LoggerFactory } from "@app/domain/factory/LoggerFactory";
import { ILogger } from "@app/domain/interfaces/ILogger";
import { IRouteHandler } from "@app/domain/interfaces/IRouteHandler";
import { injectable } from "tsyringe";
import { Request, Response } from "express";
import { SurveyAnswerService } from "@app/application/SurveyAnswerService";
import { SurveyAnswer } from "@app/domain/SurveyAnswer";
import { AuthenticatedRequest } from "@app/application/util";

@injectable()
export class AnswerUpdateHandler implements IRouteHandler<boolean> {
  
  private readonly _logger: ILogger = LoggerFactory.getLogger(AnswerUpdateHandler.name);

  public constructor(private readonly _surveyAnswerService: SurveyAnswerService) { }

  public handle(req: Request, res: Response): void {
    if (!this.validation(req, res)) {
      return;
    }
    this.execute(req)
      .then(() => {
        res.status(200).send(`All answers were successfully updated for user `);
      })
      .catch(() => {
        this._logger.ERROR(`Server error, failed to update answers for user `);
        res.status(500).send("Server error, could not update answers, please try again");
      });
  }

  public async execute(req: Request): Promise<boolean> {
    const answers: SurveyAnswer[] = req.body;
    answers.forEach(survey => { survey.note = survey.note ?? null; });
    return this._surveyAnswerService.update(answers);
  }

  public validation(...args: any[]): boolean {
    const res: Response = args[1];
    const req: AuthenticatedRequest = args[0];
    const answers: SurveyAnswer[] = req.body;
    const userId: string = req.auth.userId;

    if (answers.length <= 0) {
      this._logger.ERROR("No answers were provided to the API");
      res.status(400).send("You must provide answers to update");
      return false;
    };

    const nonMatchUserIds: SurveyAnswer[] = answers.filter(answer => answer.userId !== userId);
    if (nonMatchUserIds.length > 0) {
      this._logger.ERROR(`User ${userId} tried to change answers that belonged to another user`);
      res.status(403).send("Failed to update answer, you can only change your own answers!");
      return false;
    }


    return true;
  }
  
}
