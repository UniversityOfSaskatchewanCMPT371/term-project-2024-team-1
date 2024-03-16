export interface ILogger {
  setLoggerName: (name: string) => void;
  INFO: (msg: string) => void;
  ERROR: (msg: string) => void;
  DEBUG: (msg: string) => void;
  TRACE: (msg: string) => void;
  WARN: (msg: string) => void;
}
