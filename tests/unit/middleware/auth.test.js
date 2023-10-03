const { User } = require("../../../models/user");
const auth = require("../../../middleware/auth");
const mongoose = require("mongoose");
// const jest = require("jest");

describe("auth middleware", () => {
	it("should populate req.user with the payload of a valid JWT", () => {
		const user = {
			_id: new mongoose.Types.ObjectId().toHexString(),
			isAdmin: true,
		};
		const token = new User(user).generateAuthToken();

		// mock the request
		const req = {
			header: jest.fn().mockReturnValue(token),
		};

		const res = {};
		const next = jest.fn();

		auth(req, res, next);

		expect(req.user).toMatchObject(user);
	});
});
