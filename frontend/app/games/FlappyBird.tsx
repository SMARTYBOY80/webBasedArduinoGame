"use client";

import { useEffect, useState } from "react";


// Game Board dimensions
const boardWidth = 900;
const boardHeight = 600;

let gameOver = false;


// Flappy Bird Component
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

        // pipe variables
        const pipeGap = 75;
        const minPipeHeight = 20;

        let pipeSpeed = 2

        // so it wont clip the floor
        const maxPipeHeight = boardHeight - pipeGap - 240;

        const pipes: Array<topPipe | bottomPipe> = [];


        // bird varibles
        class Bird {
            x : number;
            // todo reserch why are all numbers defined as number instead of int or float
            y : number;
            size : number;
            velocity : number;

            constructor(y : number, velocity : number) {
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
            x: number;
            y: number;
            width: number;
            height: number;

            constructor(x: number, y: number, height: number) {
                this.x = x;
                this.y = y;
                this.width = 50;
                this.height = height;
            }
        }

        class bottomPipe {
            x: number;
            y: number;
            width: number;
            height: number;

            constructor(x: number, y: number, height: number) {
                this.x = x;
                this.y = y;
                this.width = 50;
                this.height = height;
            }
        }


        const bird = new Bird(150, 0);

        // draw scene


        function drawGround(ctx : CanvasRenderingContext2D) {
            // draw ground
            ctx.fillStyle = "lightGreen";
            ctx.fillRect(0, boardHeight - 100, boardWidth, 100);
        }

        function drawBird(ctx : CanvasRenderingContext2D){
            // draw bird
            ctx.fillStyle = "yellow";
            ctx.fillRect(bird.x, bird.y, bird.size, bird.size);

        }

        function drawPipes(ctx : CanvasRenderingContext2D) {
            // draw pipes
            ctx.fillStyle = "green";
            for (const pipe of pipes) {
                ctx.fillRect(pipe.x, pipe.y, pipe.width, pipe.height);
            }
        }

        function drawScene(ctx : CanvasRenderingContext2D) {
            // clear canvas
            ctx.clearRect(0, 0, boardWidth, boardHeight);

            drawBird(ctx);

            drawPipes(ctx);

            drawGround(ctx);
        }

        function makePipe() {

            const topPipeHeight = Math.floor(Math.random() * (maxPipeHeight - minPipeHeight + 1)) + minPipeHeight ;
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

        // game loop
        let lastPipeTime = 0;
        makePipe();
        function update(time = 0) {
            if (ctx == null ){return}
            drawScene(ctx)

            bird.velocity += gravity;
            bird.y += bird.velocity;

            console.log(typeof (lastPipeTime));

            lastPipeTime += 1;

            // move pipes
            movePipes();

            // add new pipe every 150 frames
            if (lastPipeTime > 150) {
                console.log(time);
                makePipe();
                lastPipeTime = 0;
            }




            // updates time aswell
            // https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame
            requestAnimationFrame(update);
        }

        update();






        // Game Controls

        document.addEventListener('keydown', function(event) {
            if (event.key === " ") {
                bird.flap()
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