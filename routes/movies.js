const express = require("express");
const router = express.Router();
const { Genre } = require("../models/genre");
const { Movie, validate } = require("../models/movie");
const auth = require("../middleware/auth");

router.get("/", async (req, res) => {
	const movies = await Movie.find().sort("title");
	res.send(movies);
});

router.get("/:id", async (req, res) => {
	const movie = await Movie.findById(req.params.id);
	if (!movie)
		return res.status(404).send("The movie with the given ID was not found");
	res.send(movie);
});

router.post("/", auth, async (req, res) => {
	const { error } = validate(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	const genre = await Genre.findById(req.body.genreId);
	if (!genre) return res.status(400).send("Invalid Genre.");

	const movie = new Movie({
		title: req.body.title,
		genre: {
			_id: genre._id,
			name: genre.name,
		},
		numberInStock: req.body.numberInStock,
		dailyRentalRate: req.body.dailyRentalRate,
	});

	res.send(await movie.save());
});

router.put("/:id", auth, async (req, res) => {
	const { error } = validate(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	const genre = await Genre.findById(req.body.genreId);
	if (!genre) return res.status(400).send("Invalid Genre.");

	let movie = await Movie.findById(req.params.id);
	if (!movie)
		return res.status(404).send("The movie you want to update does not exist.");

	movie.title = req.body.title;
	movie.genre = {
		_id: genre._id,
		name: genre.name,
	};
	movie.numberInStock = req.body.numberInStock;
	movie.dailyRentalRate = req.body.dailyRentalRate;

	res.send(await movie.save());
});

router.delete("/:id", async (req, res) => {
	res.send(await Movie.findByIdAndDelete(req.params.id));
});

module.exports = router;
