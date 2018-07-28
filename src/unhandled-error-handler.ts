import {Handler, Logger} from './types';

export default (): Handler => {
	return async function unhandledErrorHandler(logger: Logger, error: Error): Promise<boolean> {
		await logger('Unhandled error: \n');
		await logger(error.stack);
		await logger('\n');
		return true;
	};
};
