/* eslint-disable @typescript-eslint/naming-convention */
import { ILogger } from "@app/domain/interfaces/ILogger";
import { Logger, configure, getLogger } from "log4js";
import log4jsConfig from "@resources/log4js-config.json";
// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
configure(log4jsConfig);

export class Log4jsLogger implements ILogger {
  private _logger!: Logger;

  public setLoggerName(className: string): void {
    this._logger = getLogger(className);
  }

  public INFO(msg: string): void {
    this._logger.info(msg);
  }

  public ERROR(msg: string): void {
    this._logger.error(msg);
  }

  public WARN(msg: string): void {
    this._logger.warn(msg);
  }

  public DEBUG(msg: string): void {
    this._logger.debug(msg);
  }
  
  public TRACE(msg: string): void {
    this._logger.trace(msg);
  }
}
