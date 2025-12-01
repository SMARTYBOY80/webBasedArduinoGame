const game = [document.getElementById("gameCanvas"), document.getElementById("scoreDisplay")];

const gameWindow = document.getElementById("window");
const startScreen = document.getElementById("startScreen");
const guide = document.getElementById("guide");
const leaderboard = document.getElementById("leaderboard");
const backButton = document.getElementById("back-btn");
const buttons = document.querySelectorAll("button");

// All pages that get opened from the menu
const pages = [guide, leaderboard];

function hidePages() {
	pages.forEach((page) => {
		if (page) page.style.display = "none";
	});
}

function showGame() {
	gameWindow.style.display = "none";
	game.forEach((element) => (element.style.display = "block"));
	startGame();
}

function goHome() {
	startScreen.style.display = "flex";
	backButton.style.display = "none";
	hidePages();
}

// Handle logic for when each button is clicked
buttons.forEach((button) => {
	button.addEventListener("click", () => {
		
            // Logic for when the back button is pressed
		if (button.className === "back") {
			goHome();
			return;
		}

            // Logic for when the play button is pressed
		if (button.className === "play") {
			showGame();
			return;
		}

            // Logic for when the guide / leaderboard button is pressed
		const target = document.getElementById(button.className);

		if (target) {
			startScreen.style.display = "none";
			hidePages();
			target.style.display = "flex";
			backButton.style.display = "flex";
		}
	});
});
