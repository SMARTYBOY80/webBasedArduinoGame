const { Led } = require("johnny-five");
const prompt = require("readline-sync");

let leds = [
	{
		pin: undefined,
		id: "red",
	},
	{
		pin: undefined,
		id: "green",
	},
];

function identify(date) {
	// For each LED we require, prompt the user for the pin number
	leds.forEach((led) => {
		led.pin = prompt.questionInt(
			`
            >> Please enter the pin number to which the "${led.id.toUpperCase()}" LED is configured to:  
            `.removeWhitespace()
		);
	});

	// Filter if LED's aren't configured
	const configuredLeds = leds.filter((led) => led.pin !== 0);

	// If any LED isn't configured, exit the configuration
	if (configuredLeds.length < 2) {
		console.error(
			`[${date.toLocalTimeString()}]: ERROR → A GREEN LED & RED LED is required for the game to run correctly.`
		);
		process.exit(1);
	}

	return configuredLeds;
}

function initalise(leds, date) {
	// Connect each LED to Johnny Five
	try {
		leds = leds.map((led) => new Led(led.pin));
		leds.forEach((led) => {
                  led.on();
            })
		console.log(
			`>> [${date.toLocaleTimeString()}]: NOTIF → ${leds.length} Leds successfully initalised.`
		);
	} catch (error) {
		console.error(
			`>> [${date.toLocaleTimeString()}]: ERROR → Failed to connect ${
				leds.length
			} to Johnny Five.`
		);
		console.error(error);
		process.exit(1);
	}

	return leds;
}

const lights = {
	identify,
	initalise,
};

module.exports = lights;
