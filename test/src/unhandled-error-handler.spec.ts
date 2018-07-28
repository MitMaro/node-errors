import {expect} from 'chai';
import * as sinon from 'sinon';
import unhandledErrorHandlerFactory from '../../src/unhandled-error-handler';

const unhandledErrorHandler = unhandledErrorHandlerFactory();

describe('base-error BaseError', function () {
	it('should log an error', async function () {
		const err = new Error();
		err.stack = 'dummy stack';
		const logger = sinon.stub().resolves();
		await unhandledErrorHandler(logger, err);
		expect(logger).to.be.calledWith('Unhandled error: \n');
		expect(logger).to.be.calledWith('dummy stack');
		expect(logger).to.be.calledWith('\n');
	});
});
