const _ = require("lodash");
const bcrypt = require("bcrypt");
const { User } = require("../models/user");
const Joi = require("joi");
const express = require("express");
const router = express.Router();

// An endpoint for authenticating users

router.post("/", async (req, res) => {
	const { error } = validate(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	const user = await User.findOne({ email: req.body.email });
	if (!user) return res.status(400).send("Invalid email or passowrd.");

	const validPassword = await bcrypt.compare(req.body.password, user.password);
	if (!validPassword) return res.status(400).send("Invalid email or passowrd.");

	// jwt.sign(payload, privatekey)
	// const token = jwt.sign({ _id: user._id }, config.get("jwtPrivateKey"));
	// Above token generation is encapsulated in user model.
	// when sending tokens, make sure to use https
	const token = user.generateAuthToken();

	res.send(token);
});

function validate(req) {
	const schema = Joi.object({
		email: Joi.string().min(5).max(255).required().email(),
		password: Joi.string().min(5).max(255).required(),
	});

	return schema.validate(req);
}

module.exports = router;
