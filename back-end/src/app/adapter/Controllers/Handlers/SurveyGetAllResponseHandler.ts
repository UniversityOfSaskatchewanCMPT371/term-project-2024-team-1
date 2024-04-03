import { SurveyService } from "@app/application/SurveyService";
import { LoggerFactory } from "@app/domain/factory/LoggerFactory";
import { ILogger } from "@app/domain/interfaces/ILogger";
import { IRouteHandler } from "@app/domain/interfaces/IRouteHandler";
import { Request, Response } from "express";
import { injectable } from "tsyringe";
import * as ExcelJs from "exceljs";
import path from "path";
import * as fs from "fs";
import { nullOrUndefined } from "@app/application/util";
import { assert } from "console";
import { SurveyResponse } from "@app/domain/SurveyResponse";

@injectable()
export class SurveyGetAllResponseHandler implements IRouteHandler<any[]> {
  private readonly _logger: ILogger = LoggerFactory.getLogger(SurveyGetAllResponseHandler.name);
  constructor(private readonly _surveyService: SurveyService) { }

  public handle(req: Request, res: Response): void {
    if (this.validation(req)) {
      this.execute(req)
        .then((responses) => {
          if (responses?.length > 0) {
            this._logger.INFO("Successfully retrieved all surveys");
            const workbook: ExcelJs.Workbook = new ExcelJs.Workbook();
            const worksheet: ExcelJs.Worksheet = workbook.addWorksheet("Responses");
            worksheet.properties.defaultColWidth = 100;
            worksheet.addRow(["User ID", "Question", "Answer", "Note"]);
            responses?.forEach(response => {
              assert(!nullOrUndefined(response.userId));
              assert(!nullOrUndefined(response.question));
              assert(!nullOrUndefined(response.answer));
              assert(!nullOrUndefined(response.note));
              const { userId, question, answer, note } = response;
              worksheet.addRow([userId, question, answer, note]);
            });

            const filePath: string = path.join(__dirname, "responses.xlsx");
            const fileStream: fs.WriteStream = fs.createWriteStream(filePath);
            workbook.xlsx.write(fileStream)
              .then(() => {
                res.download(filePath, "responses.xlsx", (err) => {
                  if (err) {
                    this._logger.ERROR("Error sending Excel file:" + String(err));
                    res.status(500).send("Error sending Excel file");
                  } else {
                    this._logger.INFO("Excel file sent successfully");
                    fs.unlinkSync(filePath);
                  }
                });
              })
              .catch((err: any) => {
                this._logger.ERROR(`Error creating Excel file: ${err}`);
                res.status(500).send("Error creating Excel file");
              });
          } else {
            this._logger.ERROR(`No responses found for survey ${req.params.surveyId}`);
            res.status(404).send(`No responses found for survey ${req.params.surveyId}`);
          }
        })
        .catch(err => {
          this._logger.ERROR(`Server failed to fetch all surveys. Error: ${err}`);
          res.status(500).send(`Server failed to fetch all surveys`);
        });
    } else {
      this._logger.INFO("Failed to get, surveyId wasn't provided");
      res.status(422).send("surveyId is required");
    }
  }

  public async execute(req: Request): Promise<SurveyResponse[]> {
    return this._surveyService.getAllResponses(Number(req.params.surveyId));
  }

  public validation(...args: any[]): boolean {
    const request: Request = args[0];
    if (nullOrUndefined(request.params) || nullOrUndefined(request.params.surveyId)) {
      return false;
    } else if (Number(request.params.surveyId) < 0) {
      return false;
    }
    return true;
  }
}
