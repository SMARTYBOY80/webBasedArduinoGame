const fs = require("fs");
const path = require("path");

// Define the path to the JSON database file
const dbPath = path.resolve(__dirname, "db.json");

function readDB() {
    // Read the raw data from the JSON file
    const data = fs.readFileSync(dbPath);
    // Parse and return the JSON data as a JavaScript object
    return JSON.parse(data);
}

function writeDB(name, score) {

    // read the current database so we can push to inner object array of scores
    const db = readDB();

    // create a new player object with an incremented ID which is the data that we want to add
    let player = { id: db.scores.length + 1, name: name, score: score };

    // push the new player object to the scores array
    db.scores.push(player);

    // write the updated database back to the JSON file
    fs.writeFileSync(dbPath, JSON.stringify(db));
}

module.exports = {
    readDB,
    writeDB,
    
};
