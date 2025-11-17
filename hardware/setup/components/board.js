const { Board } = require("johnny-five");
const prompt = require("readline-sync");

function initalise(date) {
	// Prompt the user for their configured COM port
	const boardPort = prompt.questionInt(
		`
      ---- CONFIGURATION ----
      !! PLEASE ENSURE YOU HAVE UPLOADED THE FIRMWARE ONTO THE BOARD BEFORE CONNECTING IT VIA THIS CONFIGURATION.
      
	  !! IF ON A MAC OR LINUX SYSTEM, PLEASE ENTER 0 TO SCAN ALL PORTS.

      !! If you're unsure what your port number is, please check the arduino IDE.

      >> Please enter the port number your board is configured at: 
      `.removeWhitespace()
	);

	// Attempt to connect to the board via Johnny-Five
	try {
		// if com port is 0, try all ports
		if (boardPort === 0) {
			const arduinoBoard = new Board();
			return arduinoBoard;
		}
		const arduinoBoard = new Board({ port: `COM${boardPort}`  });
		

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
