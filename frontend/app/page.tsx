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
    shape: number[][];
    color: string;
    x: number;
    y: number;
}

// tetrominoes
const tetrominoes: { [key: string]: tetromino } = {

    // all shapes and their rotations
    I: {
        shape: [[1, 1, 1, 1]],
        color: "lightBlue",
        x: 0,
        y: -2,
    },
    J: {
        shape: [
            [1, 0, 0],
            [1, 1, 1],
        ],
        color: "darkBlue",
        x: 0,
        y: -2,
    },
    L: {
        shape: [
            [0, 0, 1],
            [1, 1, 1],
        ],
        color: "orange",
        x: 0,
        y: -2,
    },
    O: {
        shape: [
            [1, 1],
            [1, 1],
        ],
        color: "yellow",
        x: 0,
        y: -2,
    },
    S: {
        shape: [
            [0, 1, 1],
            [1, 1, 0],
        ],
        color: "green",
        x: 0,
        y: -2,
    },
    Z: {
        shape: [
            [1, 1, 0],
            [0, 1, 1],
        ],
        color: "red",
        x: 0,
        y: -2,
    },
    T: {
        shape: [
            [0, 1, 0],
            [1, 1, 1],
        ],
        color: "purple",
        x: 0,
        y: -2,
    },
};




export default function Tetris() {
    
  const [score, setScore] = useState(0);

  useEffect(() => {


    // Game Board
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = boardWidth * blockSize;
    canvas.height = boardHeight * blockSize;
    canvas.style.border = "1px solid #000";
    canvas.style.backgroundColor = "#2598fe";
    document.body.appendChild(canvas);

    const board: (string | null)[][] = Array.from({ length: boardHeight }, () =>
      Array(boardWidth).fill(null)
    );


    // Current Tetromino

    let currentTetromino = getRandomTetromino();
    let dropCounter = 0;
    let dropInterval = 100;
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
      for (let y = 0; y < boardHeight; y++) {
        for (let x = 0; x < boardWidth; x++) {
          if (board[y][x]) {
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
      if (ctx == null) return;
      ctx.fillStyle = currentTetromino.color;
      currentTetromino.shape.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value) {
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
      for (let y = 0; y < currentTetromino.shape.length; y++) {
        for (let x = 0; x < currentTetromino.shape[y].length; x++) {
          if (currentTetromino.shape[y][x]) {
            const nextX = currentTetromino.x + x;
            const nextY = currentTetromino.y + y;
            if (
              floorCollision(nextY) || hitWall(nextX) || hitBlock(nextX, nextY)
            ) {
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



      if(collision(currentTetromino)) {

        currentTetromino.y--; // move back up to last valid position

        // merge tetromino into board
        currentTetromino.shape.forEach((row, y) => {
          row.forEach((value, x) => {
            if (value) {
              board[currentTetromino.y + y][currentTetromino.x + x] = currentTetromino.color;
            }
          });
        });

        // get new tetromino if the previous one has collided with another block or the floor and landed
        currentTetromino = getRandomTetromino();


        // check if there is a loss
        if(lossDetection(currentTetromino)) {
          gameOver = true;
          drawBoard();
        }

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

      // if game over, alert score and reload page
      if (gameOver) {
        // TODO: make it look nice in the end
        return;
      }
    }

      // move tetromino down by one if drop interval has passed

      if (time - lastTime > dropInterval) {
          currentTetromino.y++;
          lastTime = time;
          dropCounter++;
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
      }
    });



    // this code is very wrong rn but i dont have an arduino to test with so will fix later when i have one cause theres no reason to pull out my hair trying to bug fix this rn
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
    <div></div>
  );
}