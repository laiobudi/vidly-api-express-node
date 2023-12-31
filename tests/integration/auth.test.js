const request = require("supertest");
const { User } = require("../../models/user");
const { Genre } = require("../../models/genre");

describe("auth middleware", () => {
	let server;

	beforeEach(() => {
		server = require("../../index");
		token = new User().generateAuthToken();
	});

	afterEach(async () => {
		await server.close();
		await Genre.deleteMany({});
	});

	let token;

	const exec = () => {
		return request(server)
			.post("/api/genres")
			.set("x-auth-token", token)
			.send({ name: "genre1" });
	};

	// beforeEach(() => {
	// });

	it("should return 401 if no token is provided", async () => {
		token = "";
		const res = await exec();
		expect(res.status).toBe(401);
	});

	it("should return 400 if the token given is invalid", async () => {
		token = "a";
		const res = await exec();
		expect(res.status).toBe(400);
	});

	it("should return 200 if the token given is valid", async () => {
		const res = await exec();
		expect(res.status).toBe(200);
	});
});
