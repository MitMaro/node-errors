import {Handler, Logger} from './types';
import unhandledErrorHandlerFactory from './unhandled-error-handler';

/** @private */
const unhandledErrorHandler = unhandledErrorHandlerFactory();

/** @private */
interface ErrorWithCause extends Error {
	cause: Error;
}

/**
 * Type guard for error with a cause property
 * @private
 */
function isErrorWithCause(error: Error | ErrorWithCause): error is ErrorWithCause {
	/* tslint:disable-next-line:strict-type-predicates */
	return (error as ErrorWithCause).cause !== undefined;
}

/**
 * An error handler system
 */
export class ErrorHandler {
	private readonly _logger: Logger;
	private readonly _handlers: Handler[];
	private _unhandledErrorHandler: Handler = unhandledErrorHandler;

	/**
	 * Construct an error handler with a logger instance
	 * @param logger a logger
	 */
	public constructor(logger: Logger) {
		this._logger = logger;
		this._handlers = [];
		this._unhandledErrorHandler = unhandledErrorHandler;
	}

	/**
	 * Register one or more handlers
	 * @param handlers A handler instance or an array of instances
	 */
	public register(handlers: Handler[] | Handler): void {
		for (const handler of Array.isArray(handlers) ? handlers : [handlers]) {
			this._handlers.push(handler);
		}
	}

	/**
	 * Set the handler that is used when an error is not handled
	 * @param handler a handler instance
	 * @returns The previously defined handler
	 */
	public setUnhandledErrorHandler(handler: Handler): Handler {
		const oldHandler = this._unhandledErrorHandler;
		this._unhandledErrorHandler = handler;
		return oldHandler;
	}

	/**
	 * Reset the unhandled error handler back to the built-in default
	 * @returns the previous handler
	 */
	public resetUnhandledErrorHandler(): Handler {
		return this.setUnhandledErrorHandler(unhandledErrorHandler);
	}

	/**
	 * The handler to handle an error that occurs
	 * @param error any error instance
	 */
	public handle = async (error: Error): Promise<void> => {
		let handled = false;
		for (const handler of this._handlers) {
			if (await handler(this._logger, error)) {
				handled = true;
				break;
			}
		}

		if (!handled) {
			await this._unhandledErrorHandler(this._logger, error);
		}

		if (isErrorWithCause(error)) {
			await this._logger('Caused by:');
			await this.handle(error.cause);
		}
	}
}
