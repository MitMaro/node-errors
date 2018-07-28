/**
 * A logger to log the error information
 * @param message A string to be logged
 */
export type Logger = (message?: string) => Promise<void>;

/**
 * An error handler that can handle a number of error types
 * @param logger the logger instance
 * @param error the error instance
 * @return true if the error was handled, otherwise false
 */
export type Handler = <T extends Error>(logger: Logger, error: T) => Promise<boolean>;
