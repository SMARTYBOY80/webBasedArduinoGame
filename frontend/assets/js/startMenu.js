

const game = [document.getElementById("gameCanvas"), document.getElementById("scoreDisplay")];
const gameWindow = document.getElementById("window");
const startScreen = document.getElementById("startScreen")
const leaderboard = document.getElementById("leaderboard")
const guide = document.getElementById("guide")
const buttons = Object.values(document.getElementsByTagName("button"));
let leaderboardText = document.getElementById("leaderboardText")

const ws = window.ws;


ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log(data);
    fillLeaderboard(data);
};



function fillLeaderboard(data){
	for(score of data.scores){
    console.log(score)
    leaderboardText.innerHTML += `<li>${score.name}, ${score.score}</li>`;

	}}


buttons.forEach((button) => {
	button.addEventListener("click", () => {

            // If the play button was clicked, then start the game
		if (button.className === "play") {
			gameWindow.style.display = "none";
			game.map((port) => {
				port.style.display = "block";
			});
                  startGame();
		} else if (button.className == "guide"){
			
			startScreen.style.display = "none"
			
			guide.style.display = "block"
		} else if (button.className == "leaderboard"){
			startScreen.style.display = "none"
			
			leaderboard.style.display = "block"

			ws.send("give me DB");
			
		} else if (button.className == "back"){
			
			startScreen.style.display = "block"
			
			guide.style.display = "none"
			leaderboard.style.display = "none"
		}
	});
});
