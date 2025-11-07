"use client";

import { useEffect, useState } from "react";


// Tetris Game Constants
// data from https://tetris.wiki/Tetris_Guideline

const boardWidth = 10;
const boardHeight = 20;
const blockSize = 30;
let gameOver = false;

// Tetromino interface
interface tetromino {
    // defining the shape of the tetrominos
    shape: number[][];
    // defining the color of the tetrominos
    color: string;
    // defining the position of the tetrominos
    x: number;
    y: number;
}

// tetrominoes
const tetrominoes: { [key: string]: tetromino } = {

    // all shapes and their rotations and colors
    I: {
        shape: [[1, 1, 1, 1]],
        color: "lightBlue",
        x: 0,
        y: 0,
    },
    J: {
        shape: [
            [1, 0, 0],
            [1, 1, 1],
        ],
        color: "darkBlue",
        x: 0,
        y: 0,
    },
    L: {
        shape: [
            [0, 0, 1],
            [1, 1, 1],
        ],
        // play testers seem to prefer darker-orange L tetromino over lighter one
        color: "darkOrange",
        x: 0,
        y: 0,
    },
    O: {
        shape: [
            [1, 1],
            [1, 1],
        ],

        // play testers seem to prefer darker-yellow O tetromino over lighter one
        color: "#CBD404",
        x: 0,
        y: 0,
    },
    S: {
        shape: [
            [0, 1, 1],
            [1, 1, 0],
        ],
        color: "green",
        x: 0,
        y: 0,
    },
    Z: {
        shape: [
            [1, 1, 0],
            [0, 1, 1],
        ],
        // play testers seem to prefer darker-red Z tetromino over lighter one
        color: "#BD0000",
        x: 0,
        y: 0,
    },
    T: {
        shape: [
            [0, 1, 0],
            [1, 1, 1],
        ],
        color: "purple",
        x: 0,
        y: 0,
    },
};



// Tetris Component
export default function Tetris() {

    // State variables for score
    const [score, setScore] = useState(0);

    useEffect(() => {


        // Game Board

        // create canvas element
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        // set canvas dimensions
        canvas.width = boardWidth * blockSize;
        canvas.height = boardHeight * blockSize;
        // style canvas
        canvas.style.border = "1px solid #000";
        canvas.style.backgroundColor = "#2598fe";
        document.body.appendChild(canvas);

        // create game board array and fill with nulls to indicate empty spaces
        const board: (string | null)[][] = Array.from({ length: boardHeight }, () =>
            Array(boardWidth).fill(null)
        );


        // sets oringnal tetromino and all game variables
        let dropCounter = 0;
        let currentTetromino = getRandomTetromino();
        let dropInterval = 400;
        let lastTime = 0;

        // get random tetromino
        function getRandomTetromino(): tetromino {
            const tetromino = Object.values(tetrominoes)[ Math.floor(Math.random() * Object.values(tetrominoes).length) ];
            tetromino.x = Math.floor(boardWidth / 2) - Math.ceil(tetromino.shape[0].length / 2);
            tetromino.y = 0;
            return tetromino;
        }


        // draw board
        function drawBoard() {
            if (ctx == null) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // draw tetrominoes that have already hit ground

            // loop through the 2d board arrays
            for (let y = 0; y < boardHeight; y++) {
                for (let x = 0; x < boardWidth; x++) {
                    // draw block if not null
                    if (board[y][x]) {
                        // set fill style to the color stored in the board array
                        ctx.fillStyle = board[y][x]!;
                        ctx.fillRect(
                            x * blockSize,
                            y * blockSize,
                            blockSize,
                            blockSize
                        );
                    }
                }
            }

            // draw current tetromino
            drawTetromino(currentTetromino);

        }

        // draw tetromino
        function drawTetromino(currentTetromino: tetromino) {
            // i still kinda dislike having to do this in ts
            if (ctx == null) return;

            // set fill style to tetromino color
            ctx.fillStyle = currentTetromino.color;
            // loop through tetromino shape array and draw blocks
            currentTetromino.shape.forEach((row, y) => {
                row.forEach((value, x) => {
                    // draw block if there is the value of 1 so if in shape array
                    if (value) {
                        // draw block at tetromino position plus offset
                        ctx.fillRect(
                            (currentTetromino.x + x) * blockSize,
                            (currentTetromino.y + y) * blockSize,
                            blockSize,
                            blockSize
                        );
                    }
                });
            });
        }

        // collision detection

        // checks if block has hit the floor
        function floorCollision(nextY: number): boolean {
            return nextY >= boardHeight;
        }

        // checks if block has hit either wall
        function hitWall(nextX: number): boolean {
            return nextX < 0 || nextX >= boardWidth;
        }

        // checks if block has hit another block
        function hitBlock(nextX: number, nextY: number): boolean {
            return nextY >= 0 && board[nextY][nextX] !== null;
        }

        // sees if any collision will occur
        function collision(currentTetromino: tetromino): boolean {
            // loop through tetromino shape array
            for (let y = 0; y < currentTetromino.shape.length; y++) {
                for (let x = 0; x < currentTetromino.shape[y].length; x++) {
                    // only check for collisions if there is a value in the shape layout
                    if (currentTetromino.shape[y][x]) {
                        // calculate next position
                        const nextX = currentTetromino.x + x;
                        const nextY = currentTetromino.y + y;
                        if (
                            // check for collisions
                            floorCollision(nextY) || hitWall(nextX) || hitBlock(nextX, nextY)
                        ) {
                            // return true if collision detected
                            return true;
                        }
                    }
                }
            }
            // returns false if no collision detected
            return false;
        }

        // loss detection
        function lossDetection(currentTetromino: tetromino) {
            return collision(currentTetromino) && currentTetromino.y === 0;
        }

        // game loop
        function update(time = 0) {
            // check for collision and handle landing
            if(collision(currentTetromino)) {

                // move back up to last valid position if collided
                currentTetromino.y--;

                // merge tetromino into board
                currentTetromino.shape.forEach((row, y) => {
                    row.forEach((value, x) => {
                        if (value) {
                            // set board cell to tetromino color as all thats needed to draw it
                            board[currentTetromino.y + y][currentTetromino.x + x] = currentTetromino.color;
                        }
                    });
                });

                // get new tetromino if the previous one has collided with another block or the floor and landed
                currentTetromino = getRandomTetromino();

                // check for completed lines
                for (let y = 0; y < boardHeight; y++) {
                    // array.every is soo nice i didnt excpect this to be a thing in js
                    // https://www.w3schools.com/jsref/jsref_every.asp
                    if (board[y].every(cell => cell !== null)) {
                        // remove completed line
                        board.splice(y, 1);
                        // add new empty line at the top
                        board.unshift(Array(boardWidth).fill(null));
                        // update score
                        setScore((prev) => prev + 100);
                    }
                }


                // check if there is a loss
                if(lossDetection(currentTetromino)) {
                    gameOver = true;
                    drawBoard();
                }

                // if game over, alert score and reload page
                if (gameOver) {
                    // TODO: make it look nice in the end
                    return;
                }
            }

            // move tetromino down by one if drop interval has passed

            if (time - lastTime > dropInterval) {
                // move tetromino down
                currentTetromino.y++;
                // update last time
                lastTime = time;
                // reset drop counter for dificulty scaling
                dropCounter++;
            }

            // feture suggested by play testers because it was too easy

            if (dropCounter > 30) {
                // increase speed but cap at 100ms interval
                dropInterval = Math.max(100, dropInterval - 20);
                // reset drop counter
                dropCounter = 0;
            }

            drawBoard();

            // updates time aswell
            // https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame
            requestAnimationFrame(update);
        }

        update();






        // Game Controls

        // dont have a aurdino to test with right now so using server sent events to simulate button presses aswell


// listen to keyboard events to move the active tetromino
        document.addEventListener('keydown', function(event) {
            if (event.key === "ArrowLeft") {
                currentTetromino.x--;
                if (collision(currentTetromino)) {
                    currentTetromino.x++;
                }
            } else if (event.key === "ArrowRight") {
                currentTetromino.x++;
                if (collision(currentTetromino)) {
                    currentTetromino.x--;
                }
            } else if (event.key === "ArrowDown") {
                currentTetromino.y++;
                if (collision(currentTetromino)) {
                    currentTetromino.y--;
                }
            } else if (event.key === "ArrowUp") {
                // rotate tetromino

                //amazignly clever solution found by user Nitin Jadhav
                // https://stackoverflow.com/questions/15170942/how-to-rotate-a-matrix-in-an-array-in-javascript

                const rotatedShape = currentTetromino.shape[0].map((val , index) => currentTetromino.shape.map(row => row[index]).reverse());

                const originalShape = currentTetromino.shape;
                currentTetromino.shape = rotatedShape;
                if (collision(currentTetromino)) {
                    currentTetromino.shape = originalShape; // revert if collision
                }
            } else if (event.key === " "){
                do{
                    currentTetromino.y++
                } while (!collision(currentTetromino))

                currentTetromino.y--
            }
        });



        // this code is very wrong rn but i dont have an arduino to test with so will fix later when i have one cause theres no reason to pull out my hair trying to bug fix this rn
        // ill write this code when i get the board also write all the comments then too
        let left = 0;
        let right = 0;
        const eventSource = new EventSource("http://localhost:4000/events");

        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.left) return left++;

            if (data.right) return right++;

        };

        return () => {
            eventSource.close();
        };


    }, []);

    return (
        // return the game board and score to the screen
        <div>
            <p>Score: {score}</p>

        </div>
    );
}