const { Button } = require("johnny-five");
const prompt = require("readline-sync");

function identify(date) {
	// Initalise a pre-existing buttons array
	let buttons = [
		{
			id: "jump",
			pin: undefined,
		},
		{
			id: "reset",
			pin: undefined,
		},
	];

	// For each button we require, ask what pin the button is located at
	buttons.forEach((button) => {
		button.pin = prompt.questionInt(
			`
            >> Please enter the pin number for the "${button.id}" button:  `.removeWhitespace()
		);
	});

	// Filter the required buttons
	const requiredButtons = buttons.filter((button) => button.pin !== 0);

	// If no buttons are able to be initalised, exit the process
	if (requiredButtons.length === 0) {
		console.error(`[${date.toLocaleTimeString()}]: ERROR → No buttons available to initalise.`);
		process.exit(1);
	}

	return requiredButtons;
}

function initalise(buttons, date) {
	const initalisedButtons = buttons.map(
		(button) =>
			new Button({
				isPullup: true,
				pin: button.pin,
				id: button.id,
			})
	);

	console.log(
		`[${date.toLocaleTimeString()}]: NOTIF → ${initalisedButtons.length} button${
			initalisedButtons.length > 1 ? "s" : ""
		} successfully! initalised.`
	);

	return initalisedButtons;
}

const buttons = {
	identify,
	initalise,
};

module.exports = buttons;
