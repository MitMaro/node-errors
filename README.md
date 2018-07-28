# Node Errors

[![Dependency Status](https://david-dm.org/MitMaro/node-errors.svg)](https://david-dm.org/MitMaro/node-errors)
[![Build Status](https://travis-ci.org/MitMaro/node-errors.svg?branch=master)](https://travis-ci.org/MitMaro/node-errors)
[![Coverage Status](https://coveralls.io/repos/github/MitMaro/node-errors/badge.svg?branch=master)](https://coveralls.io/github/MitMaro/node-errors?branch=master)
[![NPM version](https://img.shields.io/npm/v/@mitmaro/errors.svg)](https://www.npmjs.com/package/@mitmaro/errors)
[![GitHub license](https://img.shields.io/badge/license-ISC-blue.svg)](https://raw.githubusercontent.com/MitMaro/node-errors/master/LICENSE.md)
[![Known Vulnerabilities](https://snyk.io/test/github/mitmaro/node-errors/badge.svg?targetFile=package.json)](https://snyk.io/test/github/mitmaro/node-errors?targetFile=package.json)

## Install

    npm install --save @mitmaro/errors

## Documentation

* [API Documentation][1]

## Usage

### Creating in instance

#### JavaScript
```javascript
const {ErrorHandler} = require('@mitmaro/errors');
const errorHandler = new ErrorHandler((msg) => process.stderr.write(msg));
```

#### TypeScript
```typescript
import {ErrorHandler} from '@mitmaro/errors';
const myLogger = async (msg: string = ''): Promise<void> => {process.stderr.write(msg)};
const errorHandler = new ErrorHandler(myLogger);
```

### Registering a handler function

#### JavaScript
```javascript
errorHandler.register((logger, err) => {
	if (err instanceof MyError) {
		logger('My Error Occurred');
		logger(err.message);
	}
});
```

#### TypeScript
```typescript

const myErrorHandler = async <MyError>(logger: Logger, err: MyError) => {
	if (err instanceof MyError) {
		logger('My Error Occurred\n');
		logger(err.message);
		return true;
	}
	return false;
};

errorHandler.register(myErrorHandler);
```

### Handling errors

#### JavaScript
```javascript
try {
    throw new Error('My Error');
}
catch (err) {
	errorHandler.handle(err);
}
```

#### TypeScript
```typescript
try {
	throw new Error('My Error');
}
catch (err) {
	errorHandler.handle(err);
}
```

### Custom errors

This library exports two error that are meant to be extended when creating custom errors. They are `RuntimeError` this
is meant for non-recoverable errors that may occur during the running of an application. The other is a `BaseError` that
is meant for all other errors. Both errors take a optional `cause` argument that allows for an error chain. The error
handler handles logging of errors that have a cause.

#### JavaScript

```javascript
const {RuntimeError} = require('@mitmaro/errors');

class MyError extends RuntimeError {
	constructor(message, cause) {
		super(message, 'MyError', cause);
	}
}
```

#### TypeScript

```typescript
import {RuntimeError} from '@mitmaro/errors';

class MyError extends RuntimeError {
	public constructor(message: string, cause?: error) {
		super(message, 'MyError', cause);
	}
}
```

## Development

Development is done using Node 8 and NPM 5, and tested against both Node 6, Node 8 and Node 10. To get started:

* Install Node 8 from [NodeJS.org][node] or using [nvm]
* Clone the repository using `git clone git@github.com:MitMaro/node-errors.git`
* `cd node-errors`
* Install the dependencies `npm install`
* Make changes, add tests, etc.
* Run linting and test suite using `npm run test`

## License

This project is released under the ISC license. See [LICENSE][LICENSE].


[1]: http://www.mitmaro.ca/node-errors/

[node]:https://nodejs.org/en/download/
[nvm]:https://github.com/creationix/nvm#installation
[LICENSE]:LICENSE
