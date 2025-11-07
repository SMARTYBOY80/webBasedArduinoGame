"use client";

import { useEffect, useState } from "react";
;


// Tetris Game Constants
// data from https://tetris.wiki/Tetris_Guideline

const boardWidth = 900;
const boardHeight = 600;

let gameOver = false;


// Tetris Component
export default function FlappyBird() {

    // State variables for score
    const [score, setScore] = useState(0);

    useEffect(() => {


        // Game Board

        // create canvas element
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // set canvas dimensions
        canvas.width = boardWidth;
        canvas.height = boardHeight;

        // style canvas
        canvas.style.border = "1px solid #000";
        canvas.style.backgroundColor = "#2598fe";
        document.body.appendChild(canvas);

        // Game Variables

        const gravity = 0.5;


        // bird varibles
        class Bird {
            constructor(y : float, velocity : float) {
                this.x = 40;
                this.y = y;
                this.width = 20;
                this.size = 20;
                this.velocity = velocity;
            }

            birdFlap() {
                this.velocity = -6;
            }

        }

        const bird = new Bird(150, 0);

        // draw scene

        function drawScene(ctx : CanvasRenderingContext2D) {
            // clear canvas
            ctx.clearRect(0, 0, boardWidth, boardHeight);

            // draw bird
            ctx.fillStyle = "yellow";
            ctx.fillRect(bird.x, bird.y, bird.size, bird.size);

        }



        // game loop
        function update(time = 0) {
            if (ctx == null ){return}
            drawScene(ctx)

            bird.velocity += gravity
            bird.y += bird.velocity





            // updates time aswell
            // https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame
            requestAnimationFrame(update);
        }

        update();






        // Game Controls

        document.addEventListener('keydown', function(event) {
            if (event.key === " ") {
                bird.velocity = -10;
            }
        });

    }, []);

    return (
        // return the game board and score to the screen
        <div>
            <p>Score: {score}</p>

        </div>
    );
}