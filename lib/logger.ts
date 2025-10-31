/**
 * Structured Logging Utility
 *
 * Provides consistent, structured logging with context and metadata.
 * Useful for debugging, monitoring, and error tracking.
 */

export enum LogLevel {
  DEBUG = "debug",
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
}

interface LogContext {
  [key: string]: unknown;
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: LogContext;
  error?: Error;
  stack?: string;
}

/**
 * Logger class for structured logging
 */
class Logger {
  private context: LogContext;

  constructor(defaultContext: LogContext = {}) {
    this.context = defaultContext;
  }

  /**
   * Create a child logger with additional context
   */
  child(context: LogContext): Logger {
    return new Logger({ ...this.context, ...context });
  }

  /**
   * Log a debug message
   */
  debug(message: string, context?: LogContext): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  /**
   * Log an info message
   */
  info(message: string, context?: LogContext): void {
    this.log(LogLevel.INFO, message, context);
  }

  /**
   * Log a warning
   */
  warn(message: string, context?: LogContext): void {
    this.log(LogLevel.WARN, message, context);
  }

  /**
   * Log an error
   */
  error(message: string, error?: Error | unknown, context?: LogContext): void {
    const errorObj = error instanceof Error ? error : undefined;
    this.log(LogLevel.ERROR, message, context, errorObj);
  }

  /**
   * Core logging function
   */
  private log(
    level: LogLevel,
    message: string,
    context?: LogContext,
    error?: Error
  ): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context: { ...this.context, ...context },
    };

    if (error) {
      entry.error = error;
      entry.stack = error.stack;
    }

    // Format output based on environment
    if (process.env.NODE_ENV === "development") {
      this.logDevelopment(entry);
    } else {
      this.logProduction(entry);
    }
  }

  /**
   * Development logging with colored output
   */
  private logDevelopment(entry: LogEntry): void {
    const colors = {
      [LogLevel.DEBUG]: "\x1b[36m", // Cyan
      [LogLevel.INFO]: "\x1b[32m", // Green
      [LogLevel.WARN]: "\x1b[33m", // Yellow
      [LogLevel.ERROR]: "\x1b[31m", // Red
    };
    const reset = "\x1b[0m";

    const color = colors[entry.level];
    const prefix = `${color}[${entry.level.toUpperCase()}]${reset}`;

    console.log(`${prefix} ${entry.timestamp} - ${entry.message}`);

    if (entry.context && Object.keys(entry.context).length > 0) {
      console.log("  Context:", entry.context);
    }

    if (entry.error) {
      console.error("  Error:", entry.error);
      if (entry.stack) {
        console.error("  Stack:", entry.stack);
      }
    }
  }

  /**
   * Production logging with JSON output
   */
  private logProduction(entry: LogEntry): void {
    // In production, output JSON for easier parsing by log aggregators
    const logData: Record<string, unknown> = {
      timestamp: entry.timestamp,
      level: entry.level,
      message: entry.message,
    };

    if (entry.context) {
      logData.context = entry.context;
    }

    if (entry.error) {
      logData.error = {
        name: entry.error.name,
        message: entry.error.message,
        stack: entry.stack,
      };
    }

    const logMethod = entry.level === LogLevel.ERROR ? console.error : console.log;
    logMethod(JSON.stringify(logData));
  }
}

/**
 * Default logger instance
 */
export const logger = new Logger({ service: "persx-ai" });

/**
 * Create a logger for a specific API route
 */
export function createAPILogger(route: string) {
  return logger.child({ type: "api", route });
}

/**
 * Create a logger for a specific component
 */
export function createComponentLogger(component: string) {
  return logger.child({ type: "component", component });
}

/**
 * Log API request/response
 */
export function logAPIRequest(
  method: string,
  path: string,
  status: number,
  duration: number,
  context?: LogContext
) {
  const apiLogger = createAPILogger(path);
  const message = `${method} ${path} ${status} - ${duration}ms`;

  if (status >= 500) {
    apiLogger.error(message, undefined, { method, path, status, duration, ...context });
  } else if (status >= 400) {
    apiLogger.warn(message, { method, path, status, duration, ...context });
  } else {
    apiLogger.info(message, { method, path, status, duration, ...context });
  }
}

/**
 * Log database operations
 */
export function logDatabaseOperation(
  operation: string,
  table: string,
  duration: number,
  error?: Error
) {
  const dbLogger = logger.child({ type: "database", operation, table });

  if (error) {
    dbLogger.error(`Database operation failed: ${operation} on ${table}`, error, {
      duration,
    });
  } else {
    dbLogger.debug(`Database operation: ${operation} on ${table}`, { duration });
  }
}

/**
 * Log authentication events
 */
export function logAuthEvent(
  event: "login" | "logout" | "signup" | "password_reset" | "failed_login",
  userId?: string,
  context?: LogContext
) {
  const authLogger = logger.child({ type: "auth", event });

  if (event === "failed_login") {
    authLogger.warn(`Authentication failed`, { userId, ...context });
  } else {
    authLogger.info(`Authentication event: ${event}`, { userId, ...context });
  }
}
