// POST /api/returns { customerId, movieId }

// Return 401 if client is not logged in
// Return 400 if the customerId is not provided
// Return 400 if the movieId is not provided
// Return 404 if no rental matches for this customer and movie
// Return 400 if rental already processed

// Return 200 if valid request
// Set the return date
// Calculate the rental fee
// Increase the stock
// Return the rental

const mongoose = require("mongoose");
const request = require("supertest");
const moment = require("moment");
const { Rental } = require("../../models/rental");
const { User } = require("../../models/user");
const { Movie } = require("../../models/movie");

describe("/api/returns", () => {
	let server;
	let customerId;
	let movieId;
	let rental;
	let movie;
	let token;

	beforeEach(async () => {
		server = require("../../index");

		customerId = new mongoose.Types.ObjectId();
		movieId = new mongoose.Types.ObjectId();
		token = new User().generateAuthToken();

		movie = new Movie({
			_id: movieId,
			title: "12345",
			dailyRentalRate: 2,
			genre: { name: "12345" },
			numberInStock: 10,
		});
		await movie.save();

		rental = new Rental({
			customer: {
				_id: customerId,
				name: "12345",
				phone: "12345",
			},
			movie: {
				_id: movieId,
				title: "12345",
				dailyRentalRate: 2,
			},
		});
		await rental.save();
	});

	afterEach(async () => {
		await server.close();
		await Rental.deleteMany({});
		await Movie.deleteMany({});
	});

	const exec = () => {
		return request(server)
			.post("/api/returns")
			.set("x-auth-token", token)
			.send({ customerId, movieId });
	};

	////// TEST CASES //////

	it("should work!", async () => {
		const result = await Rental.findById(rental._id);
		expect(result).not.toBeNull();
	});

	it("should return 401 if client is not logged in", async () => {
		token = "";
		const res = await exec();
		expect(res.status).toBe(401);
	});

	it("should return 400 if the customerId is not provided", async () => {
		customerId = "";
		const res = await exec();
		expect(res.status).toBe(400);
	});

	it("should return 400 if the movieId is not provided", async () => {
		movieId = "";
		const res = await exec();
		expect(res.status).toBe(400);
	});

	it("should return 404 if no rental matches for this customer and movie", async () => {
		await Rental.deleteMany({});
		const res = await exec();
		expect(res.status).toBe(404);
	});

	it("should return 400 if rental already processed", async () => {
		rental.dateReturned = new Date();
		await rental.save();
		const res = await exec();
		expect(res.status).toBe(400);
	});

	it("should return 200 if valid request", async () => {
		const res = await exec();
		expect(res.status).toBe(200);
	});

	it("should set the returnDate if input is valid", async () => {
		await exec();
		const rentalInDb = await Rental.findById(rental._id);
		const diff = new Date() - rentalInDb.dateReturned;
		expect(diff).toBeLessThan(10 * 1000);
	});

	it("should set the rentalFee if input is valid", async () => {
		rental.dateOut = moment().add(-7, "days").toDate(); // 7 days ago
		await rental.save();
		await exec();
		const rentalInDb = await Rental.findById(rental._id);
		expect(rentalInDb.rentalFee).toBe(14);
	});

	it("should increase the movie stock after return is processed", async () => {
		await exec();
		const movieInDb = await Movie.findById(movieId);
		expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1);
	});

	it("should return the rental if input is valid", async () => {
		const res = await exec();
		// expect(res.body).toHaveProperty("dateOut");
		// expect(res.body).toHaveProperty("dateReturned");
		// expect(res.body).toHaveProperty("rentalFee");
		// expect(res.body).toHaveProperty("customer");
		// expect(res.body).toHaveProperty("movie");

		expect(Object.keys(res.body)).toEqual(
			expect.arrayContaining([
				"dateOut",
				"dateReturned",
				"rentalFee",
				"customer",
				"movie",
			])
		);
	});
});
