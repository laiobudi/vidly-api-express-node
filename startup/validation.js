const Joi = require("joi"); // request validation

module.exports = function () {
	// addon for Joi to validate oid
	Joi.objectId = require("joi-objectid")(Joi);
};
