/**
 * BaseError is the super class for all exceptions
 */
export class BaseError extends Error {
	/** The error message */
	public message: string;

	/** The name of the error, which is generally the constructor name */
	public name: string;

	/** A value to identify the error from other errors */
	public type: string;

	/** The error, if exists, that caused this error */
	public cause?: Error;

	/**
	 * Construct a BaseError
	 * @param message The error message
	 * @param type The identity of this error
	 * @param cause The causing error of this error
	 */
	public constructor(message: string, type: string, cause?: Error) {
		super(message);

		this.message = message;
		this.name = this.constructor.name;
		this.type = type;
		this.cause = cause;
		Error.captureStackTrace(this, this.constructor);
	}
}
