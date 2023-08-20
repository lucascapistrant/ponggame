const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const scoreReader = document.getElementById('score')
const enemyScorer = document.getElementById('enemy-light')
const playerScorer = document.getElementById('player-light')
const playerPoints = document.getElementById('player-score')
const enemyPoints = document.getElementById('enemy-score')
const gameText = document.getElementById('gameText')

let points = 0;
let enemyScore = 0;
let playerScore = 0;

let x = canvas.width/2;
let y = canvas.height-30;
let dx = 2;
let dy = -2;

const ballRadius = 10;

const paddleHeight = 10;
const paddleWidth = 75;

let paddleX = (canvas.width-paddleWidth)/2;

let enemyX = (canvas.width-paddleWidth)/2;

let rightPressed = false;
let leftPressed = false;

let enemyDiff = .1;


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

function drawEnemy() {
    ctx.beginPath();
    ctx.rect(enemyX, 0, paddleWidth, paddleHeight);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.closePath();
}

// Movement functions

let currentPoint = 0;
function ballMovement() {
    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if (y + dy < ballRadius + paddleHeight) {
        if (x > enemyX && x < enemyX + paddleWidth) {
            dy = -dy;
            points++
            scoreReader.innerHTML = points
        }
        else if(y + dy < ballRadius){
            resetGame('player')
        }
    }
    else if (y + dy > canvas.height - ballRadius - paddleHeight) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
            points++;
            scoreReader.innerHTML = points
        }
        else if(y + dy > canvas.height - ballRadius) {
            resetGame('enemy')
        }
    }  
    
    x += dx;
    y += dy;
    
    if(points % 10 === 0 && points !== 0) {
        if(currentPoint !== points) {
            if(dx < 0) dx = dx - .1
            if(dx > 0) dx = dx + .1
            if(dy < 0) dy = dy - .1
            if(dy > 0) dy = dy + .1
            console.log('speedUp')
            gameText.innerHTML = 'SPEED UP!'
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

function enemyMovement() {
    if(enemyLogic()) {
        if(enemyX < x - (paddleWidth / 2)) {
            enemyX += 7;
            if(enemyX + paddleWidth > canvas.width){
                enemyX = canvas.width - paddleWidth;
            }
        }
        if(enemyX > x - (paddleWidth / 2)) {
            enemyX -= 7;
            if(enemyX < 0) {
                enemyX = 0;
            }
        }
    }
}

function enemyLogic() {
    if(Math.random() * enemyDiff > .5) return true;
    else return false;
}
// Other functions

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    ballMovement();
    drawPaddle();
    paddleMovement();
    drawEnemy();
    enemyMovement();
    scoreBoard();
}


const startButton = document.getElementById('start')
let interval;
function startGame() {
    interval = setInterval(draw, 10);
    startButton.style.display = 'none'
    gameText.style.display = 'none'
    clearInterval(sliderInterval);
    dx = 0;
    dy = 0;
    setTimeout(() => {
        dx = 2;
        dy = -2;
    }, 2000);
}

function endGame() {
    clearInterval(interval);
    sliderInterval = setInterval(slider, 10)
    interval;
    startButton.style.display = 'block'
    gameText.innerHTML = `${winner} WON!`
    gameText.style.display = 'block'
    playerScore = 0;
    enemyScore = 0;
}

function resetGame(winner) {
    x = canvas.width / 2
    y = canvas.height / 2
    dx = 0; dy = 0;
    points = 0;
    scoreReader.innerHTML = 0;
    paddleX = (canvas.width-paddleWidth)/2;
    enemyX = (canvas.width-paddleWidth)/2;
    if(winner === 'player') {
        playerScore++;
        playerPoints.style.color = 'limegreen';
        enemyScorer.style.background = 'red'
        setTimeout(() => {
            enemyScorer.style.background = 'limegreen'
            playerPoints.style.color = '#fff';
        }, 250);
    }
    else if(winner === 'enemy') {
        enemyScore++;
        enemyPoints.style.color = 'red';
        playerScorer.style.background = 'red';
        setTimeout(() => {
            playerScorer.style.background = 'limegreen'
            enemyPoints.style.color = '#fff'
        }, 250);
    }
    
    setTimeout(() => {
        if(winner === 'player') {
            dy = 2;
            dx = 2;
        }
        else if(winner === 'enemy') {
            dy = -2;
            dx = -2;
        }
    }, 3000);
}

const pointsToWin = 10;
function scoreBoard() {
    playerPoints.innerHTML = playerScore;
    enemyPoints.innerHTML = enemyScore;
    if(playerScore >= pointsToWin) winner = 'YOU'
    if(enemyScore >= pointsToWin) winner = 'AI'
    if(playerScore >= pointsToWin || enemyScore >= pointsToWin) {
        endGame();
    }
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

// Game UI

const enemyDiffSlider = document.getElementById('enemyDiff')
const enemyDiffReader = document.getElementById('enemyDiffReader')
enemyDiffSlider.value = .6;
let sliderInterval = setInterval(slider, 10);
function slider() {
    enemyDiff = enemyDiffSlider.value
    if(enemyDiff == .6) {
        enemyDiffReader.innerHTML = 'Baby'
    }
    else if(enemyDiff == .7) {
        enemyDiffReader.innerHTML = 'Easy';
    }
    else if(enemyDiff == .8) {
        enemyDiffReader.innerHTML = 'Mid';
    }
    else if(enemyDiff == .9) {
        enemyDiffReader.innerHTML = 'Hard';
    }
    else if(enemyDiff == 1) {
        enemyDiffReader.innerHTML = 'no';
    }
}