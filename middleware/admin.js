function admin(req, res, next) {
	// req.user

	// 401 Unauthorized (need correct identity document)
	// 403 Forbidden (you can't access it)
	if (!req.user.isAdmin) return res.status(403).send("Access denied.");
	next();
}

module.exports = admin;

// Have a lot of external resources
// good candidate for integration tests
// bad for unit tests - too much mocking is needed
