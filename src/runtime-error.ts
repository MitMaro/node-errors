import {BaseError} from './base-error';

/**
 * RuntimeError is the super class for all errors that can occur at Runtime
 */
export class RuntimeError extends BaseError {
	/**
	 * Create a Runtime error
	 * @param message The error message
	 * @param cause The causing error of this error
	 */
	public constructor(message: string, cause?: Error);

	/**
	 * Create a Runtime error
	 * @param message The error message
	 * @param type The identity of this error
	 * @param cause The causing error of this error
	 */
	public constructor(message: string, type?: string, cause?: Error);

	public constructor(message: string, type?: string | Error, cause?: Error) {
		/* tslint:disable:no-parameter-reassignment */
		if (type === undefined) {
			type = 'RuntimeError';
		}
		else if (type instanceof Error) {
			cause = type;
			type = 'RuntimeError';
		}
		/* tslint:enable:no-parameter-reassignment */
		super(message, type, cause);
	}
}
