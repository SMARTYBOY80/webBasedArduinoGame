const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const components = require("./hardware/setup/index");

const { writeDB, readDB } = require("./hardware/setup/db/db"); 

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

	// // Initalise the hardware components
	// const board = components.board.initalise(date);
	// const buttons = components.buttons.identify(date);
	// const lights = components.lights.identify(date);

	// Generate the website as a static component
	app.use(express.static("frontend"));

	// Start the server on port 3000
	server.listen(3000, () => {
		console.log(
			`>> [${date.toLocaleTimeString()}]: NOTIF → Flappy Bird is running at http://localhost:3000 !`.removeWhitespace()
		);
	});


wss.on("connection", ws => {

  ws.on("message", message => {
    const data = JSON.parse(message);
	writeDB(data.name, data.score); 
});
	});

	// ---- LOGIC FOR WHEN THE BOARD IS READY ---- \\
	// board.on("ready", function () {
	// 	const initalisedButtons = components.buttons.initalise(buttons, date);
	// 	components.lights.initalise(lights, date);

	// 	initalisedButtons.forEach((button) => {
	// 		button.on("press", () => {
	// 			wss.clients.forEach((client) => {
	// 				if (client.readyState === WebSocket.OPEN) {
	// 					client.send(JSON.stringify({ event: "buttonPress", id: button.id }));
	// 					console.log(`>> [${date.toLocaleTimeString()}]: NOTIF → Button ${button.id} was pressed.`);
	// 				}
	// 			});
	// 		});
	// 	});
	// });

	// board.on("error", (error) => {
	// 	console.error(
	// 		`>> [${date.toLocaleTimeString()}]: ERROR → Unexpected Error occurred while connected to the board.`.removeWhitespace()
	// 	);
	// 	console.error(error);
	// });
})();
