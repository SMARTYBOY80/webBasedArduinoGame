const game = [document.getElementById("gameCanvas"), document.getElementById("scoreDisplay")];
const gameWindow = document.getElementById("window");
const buttons = Object.values(document.getElementsByTagName("button"));

buttons.forEach((button) => {
	button.addEventListener("click", () => {

            // If the play button was clicked, then start the game
		if (button.className === "play") {
			gameWindow.style.display = "none";
			game.map((port) => {
				port.style.display = "block";
			});
                  startGame();
		}
	});
});
