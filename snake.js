const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const box = 20;
let snake = [{x: 9*box, y: 10*box}];
let direction = null;
let apple = {
    x: Math.floor(Math.random()*20)*box,
    y: Math.floor(Math.random()*20)*box
};
let score = 0;
let gameOver = false;

let touchStartX = 0, touchStartY = 0;
function handleTouchStart(e) {
    const t = e.touches[0];
    touchStartX = t.clientX;
    touchStartY = t.clientY;
}
function handleTouchMove(e) {
    if (gameOver) return;
    const t = e.touches[0];
    const dx = t.clientX - touchStartX;
    const dy = t.clientY - touchStartY;
    if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 20 && direction !== 'LEFT') direction = 'RIGHT';
        else if (dx < -20 && direction !== 'RIGHT') direction = 'LEFT';
    } else {
        if (dy > 20 && direction !== 'UP') direction = 'DOWN';
        else if (dy < -20 && direction !== 'DOWN') direction = 'UP';
    }
    touchStartX = t.clientX;
    touchStartY = t.clientY;
}

function isMobile() {
    return window.matchMedia('(max-width: 500px)').matches;
}

function setupControls() {
    document.body.ontouchstart = null;
    document.body.ontouchmove = null;
    document.body.ontouchend = null;
    canvas.ontouchstart = null;
    canvas.ontouchmove = null;
    canvas.ontouchend = null;
    canvas.onmousedown = null;

    if (isMobile()) {
        document.body.addEventListener('touchstart', handleTouchStart, {passive: false});
        document.body.addEventListener('touchmove', handleTouchMove, {passive: false});
        document.body.addEventListener('touchend', function(e) {
            if (gameOver) resetGame();
        });
    } else {
        canvas.addEventListener('touchstart', handleTouchStart, {passive: false});
        canvas.addEventListener('touchmove', handleTouchMove, {passive: false});
        canvas.addEventListener('touchend', function(e) {
            if (gameOver) resetGame();
        });
        canvas.addEventListener('mousedown', function(e) {
            if (gameOver) resetGame();
        });
    }
}

function keydownRestartHandler(e) {
    if (gameOver && (e.key === 'Enter')) resetGame();
}
document.removeEventListener('keydown', keydownRestartHandler);
document.addEventListener('keydown', keydownRestartHandler);

document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
    if (e.key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
    if (e.key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
    if (e.key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
});

function drawSnake() {
    ctx.fillStyle = '#b74b4b';
    snake.forEach((segment, i) => {
        ctx.fillRect(segment.x, segment.y, box, box);
        ctx.strokeStyle = '#fff';
        ctx.strokeRect(segment.x, segment.y, box, box);
    });
}

function drawApple() {
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(apple.x + box/2, apple.y + box/2, box/2-2, 0, 2*Math.PI);
    ctx.fill();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSnake();
    drawApple();
}

function moveSnake() {
    if (!direction) return;
    const head = {x: snake[0].x, y: snake[0].y};
    if (direction === 'LEFT') head.x -= box;
    if (direction === 'UP') head.y -= box;
    if (direction === 'RIGHT') head.x += box;
    if (direction === 'DOWN') head.y += box;

    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
        gameOver = true;
        return;
    }
    for (let i = 0; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver = true;
            return;
        }
    }
    if (head.x === apple.x && head.y === apple.y) {
        score++;
        document.getElementById('score').textContent = 'Score: ' + score;
        apple = {
            x: Math.floor(Math.random()*20)*box,
            y: Math.floor(Math.random()*20)*box
        };
    } else {
        snake.pop();
    }
    snake.unshift(head);
}

let gameInterval;
function resetGame() {
    snake = [{x: 9*box, y: 10*box}];
    direction = null;
    apple = {
        x: Math.floor(Math.random()*20)*box,
        y: Math.floor(Math.random()*20)*box
    };
    score = 0;
    gameOver = false;
    document.getElementById('score').textContent = 'Score: ' + score;
    draw();
    clearTimeout(gameInterval);
    setTimeout(gameLoop, 400);
}

function gameLoop() {
    if (gameOver) {
        ctx.fillStyle = '#fff';
        ctx.font = '2rem Poppins, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over!', canvas.width/2, canvas.height/2);
        ctx.font = '1.2rem Poppins, sans-serif';
        ctx.fillText('Score: ' + score, canvas.width/2, canvas.height/2 + 40);
        return;
    }
    moveSnake();
    draw();
    gameInterval = setTimeout(gameLoop, 200);
}
draw();
gameInterval = setTimeout(gameLoop, 400);
setupControls();
window.addEventListener('resize', setupControls);
