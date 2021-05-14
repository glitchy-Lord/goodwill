// look more into class extends new super and constructor

class ExpressError extends Error {
	constructor(message, statusCode) {
		super();
		this.message = message;
		this.statusCode = statusCode;
	}
}

module.exports = ExpressError;
