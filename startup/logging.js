require("express-async-errors"); // handle exceptions in route handlers
require("winston-mongodb"); // for winston to talk to db
// ^ may need to comment out
const { createLogger, transports, format } = require("winston"); // logger

const alignColorsAndTime = format.combine(
	format.label({
		label: "[LOGGER]",
	}),
	format.timestamp({
		format: "YYYY-MM-DD HH:mm:ss",
	}),
	format.printf(
		(info) => `${info.label} ${info.timestamp} ${info.level}:  ${info.message}`
	),
	format.colorize({
		all: true,
	})
);

const logger = createLogger({
	transports: [
		new transports.File({ filename: "./logs/logfile.log" }),
		// may need to comment out MongoDB transport
		new transports.MongoDB({
			db: "mongodb://172.28.208.1/my-vidly",
			level: "error",
			options: { useUnifiedTopology: true },
		}),
		new transports.Console({
			format: alignColorsAndTime,
			handleExceptions: true,
			handleRejections: true,
		}),
	],
	// auto catch exceptions anywhere in the app
	// you must require() in index.js at the very top
	exceptionHandlers: [
		new transports.File({
			filename: "./logs/Excpetions.log",
			handleRejections: false,
		}),
	],
	rejectionHandlers: [
		new transports.File({
			filename: "./logs/Rejections.log",
			handleExceptions: false,
		}),
	],
	// exitOnError: false,
});

module.exports = logger;

// create loggers

// winston.add(new winston.transports.File({ filename: "logfile.log" }));
// winston.add(
// 	new winston.transports.MongoDB({
// 		db: "mongodb://172.28.208.1/my-vidly",
// 		level: "error",
// 		options: { useUnifiedTopology: true },
// 		metaKey: "err",
// 	})
// );

// traditional excpetions and rejections handling...

// handle uncaught excpetions
// deals with 'throw new Error()' anywhere in the application
// process.addListener("uncaughtException", (ex) => {
// 	winston.error(ex.message, ex);
// 	process.exit(1);
// });

// handle unhandled promise rejections
// deals with rejected promises
// 'throw new Error()' inside an async function is a promise rejection
// if this wasn't setup, the error with be catched as 'uncaughtException'
// process.addListener("unhandledRejection", (ex) => {
// 	winston.error(ex.message, ex);
// 	process.exit(1);
// });
