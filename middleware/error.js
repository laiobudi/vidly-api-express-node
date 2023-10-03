const logger = require("../startup/logging");

// most important(0) => least important(6)
// if set level: info, { error, warn, info } will be logged
const levels = {
	error: 0,
	warn: 1,
	info: 2,
	http: 3,
	verbose: 4,
	debug: 5,
	silly: 6,
};

module.exports = function (err, req, res, next) {
	// Log the exception
	logger.error("", err);

	res.status(500).send("Something failed.");
};
