const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const components = require("./hardware/setup/index");
const { writeDatabase, readDatabase } = require("./hardware/setup/database/databaseHandler");

// Inject a custom javascript function for readability in the console
if (!String.prototype.removeWhitespace) {
	Object.defineProperty(String.prototype, "removeWhitespace", {
		value: function () {
			return this.replace(/^[ \t]+/gm, "").trim();
		},
	});
}

(() => {
	// Initalise all variables needed before connecting to the board
	const date = new Date(Date.now());
	const app = express();
	const server = http.createServer(app);
	const wss = new WebSocket.Server({ server });

	// Initalise the hardware components
	const board = components.board.initalise(date);
	const buttons = components.buttons.identify(date);
	const lights = components.lights.identify(date);
	const sensors = components.sensor.identify(date);

	// Generate the website as a static component
	app.use(express.static("frontend"));

      // Initalise a leaderboard endpoint so we can fetch the leaderboard from the database
	app.get("/api/leaderboard", (request, response) => {
		try {
			const database = readDatabase();
			response.json(database.scores);
		} catch (error) {
			response.status(500).json({ error: "Failed to load leaderboard." });
			console.error("Failed to load leaderboard:");
			console.error(error);

			return null;
		}
	});

	// Start the server on port 3000
	server.listen(3000, () => {
		console.log(
			`>> [${date.toLocaleTimeString()}]: NOTIF → Flappy Bird is running at http://localhost:3000 !`.removeWhitespace()
		);
	});

	wss.on("connection", (ws) => {

		ws.on("message", (message) => {
			try {
				const data = JSON.parse(message);

				// SAVE SCORE TO DATABASE
				if (data.name && typeof data.score === "number") {
					writeDatabase(data.name, data.score);
				}

				ws.send(JSON.stringify({ event: "scoreSaved" }));
			} catch (error) {
				console.log(">> Message was not JSON:", message.toString());
			}
		});
	});

	// ---- LOGIC FOR WHEN THE BOARD IS READY ---- \\
	board.on("ready", function () {
		// Initalise all configured buttons
		const initalisedButtons = components.buttons.initalise(buttons, date);

		// Initalise all configured LEDs
		components.lights.initalise(lights, date);

		const initalisedSensors = components.sensor.initalise(sensors, date);

		// For all the buttons configured, send an event to the website for further validation
		initalisedButtons.forEach((button) => {
			button.on("press", () => {
				wss.clients.forEach((client) => {
					if (client.readyState === WebSocket.OPEN) {
						client.send(JSON.stringify({ event: "buttonPress", id: button.id }));
					}
				});
			});
		});
		initalisedSensors.forEach((sensor) => {
			sensor.on("motionstart", () => {
				wss.clients.forEach((client) => {
					if (client.readyState === WebSocket.OPEN) {
						client.send(JSON.stringify({
							event: "sensorMotion",
							id: sensor.id
						}));
					}
				});
			});
		});



	});

	// If the board receives an error, then display it in the console
	board.on("error", (error) => {
		console.error(
			`>> [${date.toLocaleTimeString()}]: ERROR → Unexpected Error occurred while connected to the board.`.removeWhitespace()
		);
		console.error(error);
	});
})();
