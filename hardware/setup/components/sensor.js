const { Motion } = require("johnny-five");
const prompt = require("readline-sync");

function identify(date) {
	// Initalise a pre-existing buttons array
	let sensors = [{
        id: "reset-sensor",
        pin: undefined,
    },
    {
        id: "flap-sensor",
        pin: undefined,
    }
    ];

	// For each button we require, ask what pin the button is located at
    sensors.forEach((sensor) => {
        sensor.pin = prompt.questionInt(
            `
            >> Please enter the pin number to which the "${sensor.id.toUpperCase()}" sensor is configured to:  
            `.removeWhitespace()
        );
    });

    // Filter if LED's aren't configured
    const configuredSensors = sensors.filter((sensor) => sensor.pin !== 0);

    // If any LED isn't configured, exit the configuration
    if (configuredSensors.length < 2) {
        console.error(
            `[${date.toLocalTimeString()}]: ERROR → A GREEN LED & RED LED is required for the game to run correctly.`
        );
        process.exit(1);
    }
    return configuredSensors;
}

function initalise(sensors, date) {
    try {
        sensors = sensors.map(
			(sensor) => new Motion({ pin: sensor.pin, id: sensor.id })
		);

        console.log(
            `>> [${date.toLocaleTimeString()}]: NOTIF → ${sensors.length} Sensors successfully initalised.`
        );
    } catch (error) {
        console.error(
            `>> [${date.toLocaleTimeString()}]: ERROR → Failed to connect`
        );
        console.error(error);
        process.exit(1);
    }

    return sensors;
}

const sensor = {
	identify,
	initalise,
};

module.exports = sensor;
