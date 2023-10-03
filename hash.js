const bcrypt = require("bcrypt");
const { has } = require("lodash");

async function run() {
	const salt = await bcrypt.genSalt(10);
	const hashed = await bcrypt.hash("1234", salt);
	console.log(salt);
	console.log(hashed);
}

run();
