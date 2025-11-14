const { Board } = require("johnny-five");
const prompt = require("readline-sync");

function initalise(date) {
	// Prompt the user for their configured COM port
	const boardPort = prompt.questionInt(
		`
      ---- CONFIGURATION ----
      !! PLEASE ENSURE YOU HAVE UPLOADED THE FIRMWARE ONTO THE BOARD BEFORE CONNECTING IT VIA THIS CONFIGURATION.
      !! IF YOU DO NOT HAVE ANY OF THE COMPONENTS CONFIGURED (EXCEPT THE BOARD), PLEASE TYPE 0.

      !! If you're unsure what your port number is, please check the arduino IDE.

      >> Please enter the port number your board is configured at: 
      `.removeWhitespace()
	);

	// Attempt to connect to the board via Johnny-Five
	try {
		const arduinoBoard = new Board({ port: `COM${boardPort}` });

		return arduinoBoard;
	} catch (error) {
		console.error(`>> [${date.toLocalTimeString()}]: ERROR → Failed to connect to the Arduino.`);
		console.error(error);
		return null;
	}
}

const board = {
	initalise,
};
module.exports = board;
