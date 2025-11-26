// game variables and classes
const gameOverScreen = document.getElementById("gameOverScreen");
const finalScoreText = document.getElementById("finalScore");
const playerNameInput = document.getElementById("playerName");
const submitScoreBtn = document.getElementById("submitScore");
const playAgainBtn = document.getElementById("playAgain");
const goHomeBtn = document.getElementById("goHome");

const boardWidth = 900;
const boardHeight = 600;
window.ws = new WebSocket("ws://localhost:3000");

let gameOver = false;
let animationId = null;

// global game state
let pipes = [];
let score = 0;
let lastPipeTime = 0;

class Bird {
	constructor(y, velocity) {
		this.x = 40;
		this.y = y;
		this.size = 20;
		this.velocity = velocity;
	}

	flap() {
		this.velocity = -10;
	}
}

class topPipe {
	constructor(x, y, height) {
		this.x = x;
		this.y = y;
		this.width = 50;
		this.height = height;
	}
}

class bottomPipe {
	constructor(x, y, height) {
		this.x = x;
		this.y = y;
		this.width = 50;
		this.height = height;
	}
}

const bird = new Bird(150, 0);

// reset game function
function resetGame() {
	// stop previous game loop
	if (animationId) {
		cancelAnimationFrame(animationId);
		animationId = null;
	}

	gameOver = true;

	// reset bird
	bird.y = 150;
	bird.velocity = 0;

	// clear pipes
	pipes = [];

	// reset score
	score = 0;
	lastPipeTime = 0;

	const scoreDisplay = document.getElementById("scoreDisplay");
	scoreDisplay.innerText = `Score: 0`;

	startGame();
}

// Flappy Bird Component
function startGame() {
	gameOver = false;

	// Game Board
	const canvas = document.getElementById("gameCanvas");
	const ctx = canvas.getContext("2d");

	// style game board
	canvas.style.border = "1px solid #000";
	canvas.style.backgroundColor = "#2598fe";

	// score display
	const scoreDisplay = document.getElementById("scoreDisplay");

	// Game Variables
	const gravity = 0.5;

	// pipe variables
	const pipeGap = 75;
	const minPipeHeight = 20;

	let pipeSpeed = 2;

	// so it wont clip the floor
	const maxPipeHeight = boardHeight - pipeGap - 240;

	// draw scene functions

	function drawGround(ctx) {
		// draw ground
		ctx.fillStyle = "lightGreen";
		ctx.fillRect(0, boardHeight - 100, boardWidth, 100);
	}

	function drawBird(ctx) {
		// draw bird
		ctx.fillStyle = "yellow";
		ctx.fillRect(bird.x, bird.y, bird.size, bird.size);
	}

	function drawPipes(ctx) {
		// draw pipes
		ctx.fillStyle = "green";
		for (const pipe of pipes) {
			ctx.fillRect(pipe.x, pipe.y, pipe.width, pipe.height);
		}
	}

	function drawScene(ctx) {
		// clear canvas
		ctx.clearRect(0, 0, boardWidth, boardHeight);

		drawBird(ctx);

		drawPipes(ctx);

		drawGround(ctx);
	}

	function makePipe() {
		const topPipeHeight =
			Math.floor(Math.random() * (maxPipeHeight - minPipeHeight + 1)) + minPipeHeight;
		const bottomPipeHeight = boardHeight - topPipeHeight - pipeGap - 100;

		const topPipeY = 0;
		const bottomPipeY = boardHeight - bottomPipeHeight;

		const pipeX = boardWidth;
		const topPipeObj = new topPipe(pipeX, topPipeY, topPipeHeight);
		const bottomPipeObj = new bottomPipe(pipeX, bottomPipeY, bottomPipeHeight);

		pipes.push(topPipeObj);
		pipes.push(bottomPipeObj);
		console.log(pipes);
	}

	function movePipes() {
		for (const pipe of pipes) {
			pipe.x -= pipeSpeed;
		}
	}

	function setScore(newScore) {
		score = newScore;
		scoreDisplay.innerText = `Score: ${score}`;
	}

	function checkCollision(ctx) {
		for (const pipe of pipes) {
			// check for collision with bird
			if (
				bird.x < pipe.x + pipe.width &&
				bird.x + bird.size > pipe.x &&
				bird.y < pipe.y + pipe.height &&
				bird.y + bird.size > pipe.y
			) {
				return true;
			}
		}

		// check for collision with ground
		if (bird.y + bird.size > boardHeight - 100) {
			// puts bird on the ground
			bird.y = boardHeight - 100 - bird.size;
			drawScene(ctx);
			return true;
		}

		return false;
	}

	function cullPipes() {
		// remove pipes that are off the screen
		for (let i = pipes.length - 1; i >= 0; i--) {
			if (pipes[i].x + pipes[i].width < -10) {
				pipes.splice(i, 1);
				console.log("the great culling has occured *laughs evilly");
			}
		}
	}

	// game loop
	makePipe();

	function update(time = 0) {
		if (gameOver) return;

		// draw everything
		drawScene(ctx);

		// update bird
		bird.velocity += gravity;
		bird.y += bird.velocity;

		// update pipe timer
		lastPipeTime += 1;

		// move pipes
		movePipes();

		// remove off screen pipes
		cullPipes();

		// add new pipe every 150 frames
		if (lastPipeTime > 150) {
			// make a new pipe
			makePipe();
			// reset timer and increase score
			lastPipeTime = 0;

			if (pipes.length === 8) {
				score += 1;
				setScore(score);
			}
		}

		// check for collisions with pipes
		if (checkCollision(ctx)) {
			gameOver = true;

			finalScoreText.innerText = `Score: ${score}`;
			gameOverScreen.classList.remove("hidden");

			return;
		}

		// updates time aswell
		// https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame
		animationId = requestAnimationFrame(update);
	}
	update();
}

// Game over Controls

// Logic for submitting the score
submitScoreBtn.addEventListener("click", () => {
	const name = playerNameInput.value.trim();

	if (name.length > 0) {
		ws.send(JSON.stringify({ name, score }));
		submitScoreBtn.innerText = "Submitted! :D";
		submitScoreBtn.disabled = true;
	}
});

// Logic for playing again
playAgainBtn.addEventListener("click", () => {
	gameOverScreen.classList.add("hidden");
	submitScoreBtn.innerText = "Submit Score";
	submitScoreBtn.disabled = false;
	playerNameInput.value = "";

	resetGame();
});

// Logic for going back to the main screen
goHomeBtn.addEventListener("click", () => {
	gameOverScreen.classList.add("hidden");
	submitScoreBtn.innerText = "Submit Score";
	submitScoreBtn.disabled = false;
	playerNameInput.value = "";

	document.getElementById("window").style.display = "flex";
	document.getElementById("startScreen").style.display = "flex";

	document.getElementById("gameCanvas").style.display = "none";
	document.getElementById("scoreDisplay").style.display = "none";
});

// Game Controls
ws.onmessage = (button) => {
	// Get the websocket data for the button press
	const buttonData = JSON.parse(button.data);
	if (buttonData.event === "buttonPress") {
		if (buttonData.id === "jump") {
			bird.flap();
		} else {
			console.log("resetting game");
			resetGame();
		}
	}
};

// document.addEventListener("keydown", function (event) {
// 	if (event.key === " ") {
// 		bird.flap();
// 	}
// 	if (event.key === "r") {
// 		console.log("resetting game");
// 		resetGame();
// 	}
// });
