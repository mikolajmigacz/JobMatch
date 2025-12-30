const LOG_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

type LogLevel = keyof typeof LOG_LEVELS;

class Logger {
  private level: LogLevel;

  constructor(level: LogLevel = 'info') {
    this.level = level;
  }

  private shouldLog(messageLevel: LogLevel): boolean {
    return LOG_LEVELS[messageLevel] <= LOG_LEVELS[this.level];
  }

  private format(level: LogLevel, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
  }

  error(message: string, error?: Error | any): void {
    if (this.shouldLog('error')) {
      if (error instanceof Error) {
        console.error(this.format('error', `${message} - ${error.message}`), error.stack);
      } else {
        console.error(this.format('error', message), error);
      }
    }
  }

  warn(message: string): void {
    if (this.shouldLog('warn')) {
      console.warn(this.format('warn', message));
    }
  }

  info(message: string): void {
    if (this.shouldLog('info')) {
      console.log(this.format('info', message));
    }
  }

  debug(message: string, data?: any): void {
    if (this.shouldLog('debug')) {
      if (data) {
        console.debug(this.format('debug', message), data);
      } else {
        console.debug(this.format('debug', message));
      }
    }
  }

  setLevel(level: LogLevel): void {
    this.level = level;
  }
}

const logger = new Logger((process.env.LOG_LEVEL as LogLevel) || 'info');

export default logger;
export { Logger };
