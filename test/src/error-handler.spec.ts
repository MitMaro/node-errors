import {expect} from 'chai';
import {ErrorHandler} from '../../src/';
import * as sinon from 'sinon';

class ErrorWithCause extends Error {
	public cause?: Error;
}

describe('error-handler ErrorHandler', function () {
	it('should register and call basic single handler', async function () {
		const loggerStub = sinon.stub();
		const handler = sinon.stub();
		const error = new Error();
		const errorHandler = new ErrorHandler(loggerStub);
		errorHandler.register(handler);
		await errorHandler.handle(error);

		expect(handler).to.be.calledWith(loggerStub, error);
	});

	it('should not call next handler on returning true', async function () {
		const loggerStub = sinon.stub();
		const handler1 = sinon.stub().returns(true);
		const handler2 = sinon.stub();
		const error = new Error();
		const errorHandler = new ErrorHandler(loggerStub);
		errorHandler.register(handler1);
		errorHandler.register(handler2);
		await errorHandler.handle(error);

		expect(handler1).to.be.called;
		expect(handler2).to.not.be.called;
	});

	it('should call next handler on returning false', async function () {
		const loggerStub = sinon.stub();
		const handler1 = sinon.stub().returns(false);
		const handler2 = sinon.stub().returns(true);
		const error = new Error();
		const errorHandler = new ErrorHandler(loggerStub);
		errorHandler.register(handler1);
		errorHandler.register(handler2);
		await errorHandler.handle(error);

		expect(handler1).to.be.called;
		expect(handler2).to.be.called;
	});

	it('should call unhandled error handler', async function () {
		const loggerStub = sinon.stub();
		const handler1 = sinon.stub().returns(false);
		const unhandledErrorHandler = sinon.stub();
		const error = new Error();
		const errorHandler = new ErrorHandler(loggerStub);
		errorHandler.register(handler1);
		errorHandler.setUnhandledErrorHandler(unhandledErrorHandler);
		await errorHandler.handle(error);

		expect(handler1).to.be.called;
		expect(unhandledErrorHandler).to.be.called;
	});

	it('should reset unhandled error handler', function () {
		const handlerStub = sinon.stub();
		const errorHandler = new ErrorHandler(sinon.stub());
		errorHandler.setUnhandledErrorHandler(handlerStub);
		errorHandler.resetUnhandledErrorHandler();
		errorHandler.handle(new Error());

		expect(handlerStub).to.not.be.called;
	});

	it('should log causing error', async function () {
		const loggerStub = sinon.stub();
		const handler = sinon.stub();
		const error = new ErrorWithCause();
		error.cause = new Error();
		const errorHandler = new ErrorHandler(loggerStub);
		errorHandler.register(handler);
		await errorHandler.handle(error);

		expect(handler).to.be.calledWith(loggerStub, error);
		expect(handler).to.be.calledWith(loggerStub, error.cause);
	});

	it('should register multiple handlers as an array', async function () {
		const loggerStub = sinon.stub();
		const handler1 = sinon.stub();
		const handler2 = sinon.stub();
		const error = new Error();
		const errorHandler = new ErrorHandler(loggerStub);
		errorHandler.register([handler1, handler2]);
		await errorHandler.handle(error);

		expect(handler1).to.be.calledWith(loggerStub, error);
		expect(handler2).to.be.calledWith(loggerStub, error);
	});
});
