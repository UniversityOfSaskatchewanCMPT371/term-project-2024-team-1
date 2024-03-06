import { container, injectable } from "tsyringe";
import { ILogger } from "../interfaces/ILogger";
import { loggerToken } from "@app/adapter/DependencyInjections";

@injectable()
export class LoggerFactory {
  public static getLogger(className: string): ILogger {
    const logger: ILogger = container.resolve(loggerToken);
    logger.setLoggerName(className);
    return logger;
  }
}
