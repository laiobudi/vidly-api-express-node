const jwt = require("jsonwebtoken");
const config = require("config");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const { User, validate } = require("../models/user");
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

// User id is obtaind from jwt through the auth middleware
router.get("/me", auth, async (req, res) => {
	const user = await User.findById(req.user._id).select("-password");
	res.send(user);
});

router.post("/", auth, async (req, res) => {
	const { error } = validate(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	let user = await User.findOne({ email: req.body.email });
	if (user) return res.status(400).send("User already registered.");

	user = new User(_.pick(req.body, ["name", "email", "password"]));

	const salt = await bcrypt.genSalt(10);
	user.password = await bcrypt.hash(user.password, salt);

	const token = user.generateAuthToken();

	await user.save();
	// lodash picks gets an object with the specified properties
	res
		.header("x-auth-token", token)
		.send(_.pick(user, ["_id", "name", "email"]));
	// This is same as the code below

	// res.send({
	// 	name: user.name,
	// 	email: user.email,
	// });
});

module.exports = router;
