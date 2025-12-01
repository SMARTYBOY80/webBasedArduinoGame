const fs = require("fs");
const path = require("path");

// Define the path to the JSON database file
const dbPath = path.resolve(__dirname, "db.json");

function readDatabase() {
	// Read the raw data from the JSON file
	const data = fs.readFileSync(dbPath);
	// Parse and return the JSON data as a JavaScript object
	return JSON.parse(data);
}

function writeDatabase(name, score) {
      
      // Read the content from the database
	const db = readDatabase();

      // Validate the name and score for each player.
	if (typeof name !== "string" || typeof score !== "number") return;

      // Create a new player object to store in the database
	const player = {
		id: Date.now(),
		name,
		score,
	};

	db.scores.push(player);

      // Write to the JSON file, and add the new player.
	fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
}

module.exports = {
	readDatabase,
	writeDatabase,
};
