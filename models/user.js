const config = require("config");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		minlength: 5,
		maxlength: 50,
	},
	email: {
		type: String,
		required: true,
		minlength: 5,
		maxlength: 255,
		unique: true,
	},
	password: {
		type: String,
		required: true,
		minlength: 5,
		maxlength: 1024,
	},
	isAdmin: Boolean,
});

// User Authentication
// Must not use arrow function
// syntax: sign(payload, privateKey)
// Binded to the userSchema so no need to import separately
userSchema.methods.generateAuthToken = function () {
	return jwt.sign(
		{ _id: this._id, isAdmin: this.isAdmin },
		config.get("jwtPrivateKey")
	);
};

const User = mongoose.model("User", userSchema);

function validateUser(user) {
	const schema = Joi.object({
		name: Joi.string().min(3).required(),
		email: Joi.string().min(5).max(255).required().email(),
		password: Joi.string().min(5).max(255).required(),
	});

	return schema.validate(user);
}

module.exports = { User, validate: validateUser };
