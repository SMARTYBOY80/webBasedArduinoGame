// game variables and classes

const boardWidth = 900;
const boardHeight = 600;
window.ws = new WebSocket("ws://localhost:3000");

let gameOver = false;

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

// Flappy Bird Component
function startGame() {
	// Game Board
	const canvas = document.getElementById("gameCanvas");
	console.log(canvas);
	const ctx = canvas.getContext("2d");

	// style game board
	canvas.style.border = "1px solid #000";
	canvas.style.backgroundColor = "#2598fe";

	// score display
	const scoreDisplay = document.getElementById("scoreDisplay");
	let score = 0;

	// Game Variables

	const gravity = 0.5;

	// pipe variables
	const pipeGap = 75;
	const minPipeHeight = 20;

	let pipeSpeed = 2;

	// so it wont clip the floor
	const maxPipeHeight = boardHeight - pipeGap - 240;

	// array to hold pipes that will be culled when off screen
	const pipes = [];

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
		for (const pipe of pipes) {
			if (pipe.x + pipe.width < -10) {
				pipes.shift();
				console.log("the great culling has occured *laughs evilly");
			}
		}
	}

	//reset game
	function resetGame(){
		lastPipeTime = 0;
		score = 0;
		setScore(score);
		bird.y = 150;
		bird.velocity = 0;
		
		pipes.length = 0;
		
		gameOver = false;
		update();
	}

	// expose globally
	// not the best way but works for now and jamie may know better
	window.resetGame = resetGame;

	// game loop
	let lastPipeTime = 0;
	makePipe();

	function update(time = 0) {
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
			score += 100;
			setScore(score);
		}

		// check for collisions with pipes
		if (checkCollision(ctx)) {
			gameOver = true;
			let name = prompt("Game Over! Enter your name: ");

			// send name and score to server
			ws.send(JSON.stringify({ name: name, score: score }));

			return;
		}

		// updates time aswell
		// https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame
		requestAnimationFrame(update);
	}
	update();

}

// Game Controls
ws.onmessage = (button) => {
	// Get the websocket data for the button press
	const buttonData = JSON.parse(button.data);

	// console.log(buttonData);

	if (buttonData.event === "buttonPress") {
		if (buttonData.id === "jump") {
			bird.flap();
		} else {
			console.log("resetting game")
			resetGame();
		}
	}
};

document.addEventListener("keydown", function(event) {
	if (event.key === ' ') {
            bird.flap();
      }
	  if (event.key === 'r') {
		console.log("resetting game")
		resetGame();
	  }
});
