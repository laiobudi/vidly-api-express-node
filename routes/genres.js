const express = require("express");
const router = express.Router();
const { Genre, validate } = require("../models/genre");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validateObjectId = require("../middleware/validateObjectId");

// const asyncMiddleware = require("../middleware/async");

// router.get(
// 	"/",
// 	asyncMiddleware(async (req, res) => {
// 		const genres = await Genre.find().sort({ name: 1 });
// 		res.send(genres);
// 	})
// );

router.get("/", async (req, res) => {
	// throw new Error("Could not get the genres");
	const genres = await Genre.find().sort({ name: 1 });
	res.send(genres);
});

router.get("/:id", validateObjectId, async (req, res) => {
	const genre = await Genre.findById(req.params.id);
	if (!genre)
		return res.status(404).send("The genre with the given ID was not found.");
	res.send(genre);
});

router.post("/", auth, async (req, res) => {
	const { error } = validate(req.body);
	if (error) return res.status(400).send(error.details[0].message);
	if (await Genre.findOne({ name: req.body.name }))
		return res.status(400).send("Genre already exists.");

	const genre = new Genre({
		name: req.body.name,
	});
	await genre.save();
	res.send(genre);
});

router.put("/:id", auth, async (req, res) => {
	const { error } = validate(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	const genre = await Genre.findById(req.params.id);
	if (!genre)
		return res.status(404).send("The genre you want to update doesn't exist.");

	genre.name = req.body.name;
	await genre.save();
	res.send(genre);
});

router.delete("/:id", [auth, admin], async (req, res) => {
	const genre = await Genre.findByIdAndDelete(req.params.id);
	if (!genre)
		return res.status(404).send("The genre with the given ID was not found.");
	res.send(genre);
});

module.exports = router;
