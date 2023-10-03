// Must import beforehand...
const logger = require("./startup/logging");
require("./startup/config")();

// Import after...
const express = require("express"); // The API framework
const app = express(); // initialise API

require("./startup/dbinit")();
require("./startup/validation")();
require("./startup/routes")(app);
require("./startup/prod")(app);

// start listening for requests...
const port = process.env.PORT || 3000;
const server = app.listen(port, () =>
	logger.info(`Listening on port ${port}...`)
);

module.exports = server;
