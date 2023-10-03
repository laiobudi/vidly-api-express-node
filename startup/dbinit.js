const mongoose = require("mongoose"); // db driver
const logger = require("./logging");
const config = require("config");

module.exports = function () {
	// Connect to db
	const db = config.get("db");
	mongoose.connect(db).then(() => logger.info(`Connected to ${db}...`));
	// .catch((err) => console.error("Could not connect to MongoDB...", err));
};
