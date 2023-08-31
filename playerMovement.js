const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const scoreReader = document.getElementById('score')
const gameText = document.getElementById('gameText')
const highscoreBlock = document.getElementById('highscore');

const ballSpeed = 3;

let points = 0;
let highscore = 0;
let x = canvas.width/2;
let y = canvas.height-30;
let dx = ballSpeed;
let dy = -ballSpeed;

const ballRadius = 10;

const paddleHeight = 10;
const paddleWidth = 75;

let paddleX = (canvas.width-paddleWidth)/2;

let rightPressed = false;
let leftPressed = false;


// Draw functions

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.closePath();
}

// Sound system setup

let audioCtx = null;
function playNote(freq, dur) {
    if(audioCtx==null){
        audioCtx=new(
          AudioContext ||
          webkitAudioContext ||
          window.webkitAudioContext
        )();
      }
      const osc = audioCtx.createOscillator();
      osc.frequency.value = freq;
      osc.start();
      osc.stop(audioCtx.currentTime+dur);
      const node = audioCtx.createGain();
      node.gain.value = 0.5;
      node.gain.linearRampToValueAtTime(
        0, audioCtx.currentTime+dur
      );
      osc.connect(node);
      node.connect(audioCtx.destination);
}

// Movement functions

let currentPoint = 0;
function ballMovement() {
    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if (y + dy < ballRadius) {
        dy = -dy;
    }
    else if (y + dy > canvas.height - ballRadius - paddleHeight) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
            points++;
            playNote(1000, .1)
            if(points > highscore) {
                updateHighScore();
            }
            scoreReader.innerHTML = points
        }
        else if(y + dy > canvas.height - ballRadius) {
            endGame();
            playNote(500, .5)
        }
    }  
    
    x += dx;
    y += dy;
    
    if(points % 10 === 0 && points !== 0) {
        if(currentPoint !== points) {
            if(dx < 0) dx = dx - .2
            if(dx > 0) dx = dx + .2
            if(dy < 0) dy = dy - .2
            if(dy > 0) dy = dy + .2
            gameText.innerHTML = 'SPEED UP!'
            playNote(1500, .25)
            gameText.style.display = 'block'
            setTimeout(() => {
                gameText.style.display = 'none'
            }, 1000);
        }
        currentPoint = points;
    }
}

function paddleMovement() {
    if(rightPressed) {
        paddleX += 7;
        if (paddleX + paddleWidth > canvas.width){
            paddleX = canvas.width - paddleWidth;
        }
    }
    else if(leftPressed) {
        paddleX -= 7;
        if (paddleX < 0){
            paddleX = 0;
        }
    }
}

// Other functions

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    ballMovement();
    drawPaddle();
    paddleMovement();
}

function updateHighScore() {
    highscore = points;
    highscoreBlock.innerHTML = highscore;
}

const startButton = document.getElementById('start');
let interval;

function startGame() {
    interval = setInterval(draw, 10);
    resetGame();
    startButton.style.display = 'none';
}

function endGame() {
    startButton.style.display = 'block';
    paddleX = canvas.width / 2 - paddleWidth / 2;
    clearInterval(interval);
}

function resetGame() {
    dx = 0;
    dy = 0;
    x = canvas.width / 2;
    y = canvas.height / 2;
    points = 0;
    scoreReader.innerHTML = points;
    setTimeout(() => {
        dy = ballSpeed;
        dx = ballSpeed;
    }, 2000)
}

// Keyboard input manager

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = true;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = false;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = false;
    }
}