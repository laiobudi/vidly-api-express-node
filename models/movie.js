const Joi = require("joi");
const mongoose = require("mongoose");
const { genreSchema } = require("./genre");

const Movie = mongoose.model(
	"Movie",
	new mongoose.Schema({
		title: {
			type: String,
			required: true,
			trim: true,
			minlength: 3,
			maxlength: 30,
		},
		genre: { type: genreSchema, required: true },
		numberInStock: { type: Number, default: 0, min: 0, max: 99 },
		dailyRentalRate: { type: Number, default: 0, min: 0, max: 5 },
	})
);

function validateMovie(movie) {
	const schema = Joi.object({
		title: Joi.string().min(3).max(30).required(),
		genreId: Joi.objectId(), // replace with Joi.objectId()
		numberInStock: Joi.number().min(0).max(99),
		dailyRentalRate: Joi.number().min(0).max(5),
	});

	return schema.validate(movie);
}

// exports.Customer = Customer;
// exports.validate = validateCustomer;

module.exports = { Movie, validate: validateMovie };
