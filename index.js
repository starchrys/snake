import img from './img.js';

const canvas = document.createElement('canvas');
document.body.append(canvas);
const ctx = canvas.getContext('2d');
canvas.width = 400;
canvas.height = 400;

const background = img('background.png');
const head = img('snake_head.png');
const body = img('snake_body.png');
const apple = img('apple.png');
const goScreen = img('gameover.png');
const restart = img('restart.png');
const splash = img('splash.png');
const start = img("start.png");

class SnakePart{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
}

let speed = 7;

let tileCount = 20;
let tileSize = canvas.width/ tileCount;
let headX = 10;
let headY = 9;
const snakeParts = [];
let tailLength = 0;

let appleX = 5;
let appleY = 5;

let xVelocity=0;
let yVelocity=0;

let score = 0;
let gameStart = false;

drawSplash();

const eatSound = new Audio("/sprites/eat.mp3");
const bgMusic = new Audio("/sprites/game.mp3");
const goSound = new Audio("/sprites/gameover.mp3");
const splashMusic = new Audio("/sprites/start.mp3");

function drawSplash(){
    gameStart = true;
    splash.onload = function(){
    ctx.drawImage(splash,0,0,400,400);
    splashMusic.play();
    splashMusic.addEventListener('ended', function() {
        this.currentTime = 0;
        this.play();
    }, false);
    };


    return gameStart;
}

function drawGame(){
    changeSnakePosition();
    let result = isGameOver();
    if(result){
        return;
    }
    
    clearScreen();
   

    checkAppleCollision(); 
    drawApple();
    drawSnake();
    drawScore();
    setTimeout(drawGame, 1000/speed);
}

function isGameOver(){
    let gameOver = false;

    if(headX < 0){
        gameOver = true;
    }

    else if(headX === tileCount){
        gameOver = true;
    }

    else if(headY < 0){
        gameOver = true;
    }

    else if(headY === tileCount){
        gameOver = true;
    }

    for(let i=0; i <snakeParts.length; i++){
        let part = snakeParts[i];
        if(part.x === headX && part.y === headY){
            gameOver = true;
            break;
        }
    }

    if (gameOver){
        ctx.save();
        ctx.setTransform(1,0,0,1,0,0);
        ctx.drawImage(goScreen,0,0,400,400);
        ctx.drawImage(restart, 140, 300, 125, 39);
        ctx.restore();
        bgMusic.pause();
        goSound.play();
    }

    return gameOver;
}

canvas.addEventListener('click', clickedGO);
function clickedGO (event){
    let result = isGameOver();
    if(result){
        gameStart=false;
        location.reload();
    }
}

canvas.addEventListener('click', clickedStart);
function clickedStart(event){
    let game = drawSplash();
    if(game){
        clearScreen();
        splashMusic.pause();
        bgMusic.play();
        drawGame();
    }
}

function drawScore(){
    document.getElementById("scoreText").innerHTML = "Score: " + score;
}

function clearScreen(){
    ctx.drawImage(background,0,0,400,400);
}

function drawSnake(){

    
    for(let i=0; i<snakeParts.length; i++){
        let part = snakeParts[i];
        ctx.drawImage(body, part.x*tileCount, part.y*tileCount, tileSize, tileSize);
    }

    snakeParts.push(new SnakePart(headX, headY));
    if(snakeParts.length>tailLength){
        snakeParts.shift();
    }

    ctx.drawImage(head,headX * tileCount,headY * tileCount, tileSize, tileSize);
}

function changeSnakePosition(){
    headX = headX + xVelocity;
    headY = headY + yVelocity;
}

function drawApple(){
    ctx.drawImage(apple, appleX * tileCount, appleY * tileCount, tileSize, tileSize);
}

function checkAppleCollision(){
    if (appleX === headX && appleY === headY){
        appleX = Math.floor(Math.random()*tileCount);
        appleY = Math.floor(Math.random()*tileCount);
        tailLength++;
        score++;
        eatSound.play()
    }
}

document.body.addEventListener('keydown', keyDown);


function keyDown(event){
    if(event.code == "ArrowUp"){
        if(yVelocity == 1)
            return;
        yVelocity = -1;
        xVelocity = 0;
    }

    if(event.code == "ArrowDown"){
        if(yVelocity == -1)
            return;
        yVelocity = 1;
        xVelocity = 0;
    }

    if(event.code == "ArrowLeft"){
        if(xVelocity == 1)
            return;
        yVelocity = 0;
        xVelocity = -1;
    }

    if(event.code == "ArrowRight"){
        if(xVelocity == -1)
            return;
        yVelocity = 0;
        xVelocity = 1;
    }
}