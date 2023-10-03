const express = require("express");
const router = express.Router();
const { Customer, validate } = require("../models/customer");
const auth = require("../middleware/auth");

router.get("/", async (req, res) => {
	return res.send(await Customer.find());
});

router.get("/:id", async (req, res) => {
	const customer = await Customer.findById(req.params.id);
	if (!customer)
		return res.status(404).send("The customer with the given ID was not found");
	res.send(customer);
});

router.post("/", auth, async (req, res) => {
	const { error } = validate(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	const alreadyExists = await Customer.findOne({
		$or: [{ name: req.body.name }, { phone: req.body.phone }],
	});
	if (alreadyExists) {
		console.log(alreadyExists);
		return res
			.status(400)
			.send("The Name or Phone number already exists. Try another one.");
	}

	const customer = new Customer({
		isGold: req.body.isGold,
		name: req.body.name,
		phone: req.body.phone,
	});
	await customer.save();
	res.send(customer);
});

router.put("/:id", auth, async (req, res) => {
	const customer = await Customer.findById(req.params.id);
	if (!customer)
		return res.status(404).send("The customer with the given ID was not found");
	for (field in req.body) customer[field] = req.body[field];
	console.log(customer);
	res.send(await customer.save());
});

router.delete("/:id", async (req, res) => {
	const customer = await Customer.findByIdAndDelete(req.params.id);
	if (!customer)
		return res.send
			.status(404)
			.send("The customer you want to delete doesn't exist.");
	res.send(customer);
});

module.exports = router;
