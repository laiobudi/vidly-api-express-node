const jwt = require("jsonwebtoken");
const config = require("config");

// User Authorisation
function auth(req, res, next) {
	const token = req.header("x-auth-token");
	// 401 Unauthorized (need correct identity document)
	if (!token) return res.status(401).send("Access denied. No token provided.");

	// compare token with set env on the server
	try {
		const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
		req.user = decoded;
		next(); // passes control to next middleware function
	} catch (ex) {
		res.status(400).send("Invalid token.");
	}
}

module.exports = auth;
