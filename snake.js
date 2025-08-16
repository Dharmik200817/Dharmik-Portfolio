const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const box = 20;
let snake = [{x: 9*box, y: 10*box}];
let apple = {
    x: Math.floor(Math.random()*20)*box,
    y: Math.floor(Math.random()*20)*box
};
let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;
let gameOver = false;
let gameStarted = false;

// Update high score display
document.getElementById('highScore').textContent = `Best: ${highScore}`;

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
    // Remove all existing event listeners safely
    try {
        document.body.ontouchstart = null;
        document.body.ontouchmove = null;
        document.body.ontouchend = null;
        canvas.ontouchstart = null;
        canvas.ontouchmove = null;
        canvas.ontouchend = null;
        canvas.onmousedown = null;

        if (isMobile()) {
            document.body.style.touchAction = 'none'; // Prevent scrolling
            document.body.addEventListener('touchstart', handleTouchStart, {passive: false});
            document.body.addEventListener('touchmove', handleTouchMove, {passive: false});
            document.body.addEventListener('touchend', function(e) {
                e.preventDefault();
                if (gameOver) resetGame();
            }, {passive: false});
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
    } catch (error) {
        console.error('Error setting up controls:', error);
    }
}

function keydownRestartHandler(e) {
    if (gameOver && (e.key === 'Enter')) resetGame();
}
document.removeEventListener('keydown', keydownRestartHandler);
document.addEventListener('keydown', keydownRestartHandler);

document.addEventListener('keydown', e => {
    // Auto-start game on first arrow key press
    if (!gameStarted && ['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown'].includes(e.key)) {
        startGame();
    }
    
    // Use nextDirection to buffer direction changes and prevent multiple changes per frame
    if (e.key === 'ArrowLeft' && direction !== 'RIGHT' && nextDirection !== 'LEFT') {
        nextDirection = 'LEFT';
    }
    if (e.key === 'ArrowUp' && direction !== 'DOWN' && nextDirection !== 'UP') {
        nextDirection = 'UP';
    }
    if (e.key === 'ArrowRight' && direction !== 'LEFT' && nextDirection !== 'RIGHT') {
        nextDirection = 'RIGHT';
    }
    if (e.key === 'ArrowDown' && direction !== 'UP' && nextDirection !== 'DOWN') {
        nextDirection = 'DOWN';
    }
});

function startGame() {
    gameStarted = true;
    // No overlay to hide anymore
    resetGame();
}

function drawSnake() {
    snake.forEach((segment, i) => {
        if (i === 0) {
            // Draw head as a red box
            ctx.fillStyle = '#ff0000';
            ctx.strokeStyle = '#b71c1c';
            ctx.fillRect(segment.x, segment.y, box, box);
            ctx.strokeRect(segment.x, segment.y, box, box);
        } else {
            // Draw body segments
            ctx.fillStyle = '#4caf50';
            ctx.strokeStyle = '#2e7d32';
            ctx.fillRect(segment.x, segment.y, box, box);
            ctx.strokeRect(segment.x, segment.y, box, box);
        }
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
    
    // Apply the buffered direction change at the start of each frame
    direction = nextDirection;
    
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
    // Clear any existing interval first
    if (gameInterval) {
        clearTimeout(gameInterval);
        gameInterval = null;
    }
    
    snake = [{x: 9*box, y: 10*box}];
    direction = 'RIGHT'; // Start moving right
    nextDirection = 'RIGHT'; // Reset the direction buffer
    apple = {
        x: Math.floor(Math.random()*20)*box,
        y: Math.floor(Math.random()*20)*box
    };
    
    // Update high score if needed
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('snakeHighScore', highScore);
        document.getElementById('highScore').textContent = `Best: ${highScore}`;
    }
    
    score = 0;
    gameOver = false;
    gameStarted = true;
    document.getElementById('score').textContent = 'Score: ' + score;
    draw();
    // SNAKE SPEED: 400ms delay between moves (lower = faster, higher = slower)
    gameInterval = setTimeout(gameLoop, 300);
}

function gameLoop() {
    if (gameOver) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#fff';
        ctx.font = '2rem Poppins, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over!', canvas.width/2, canvas.height/2 - 20);
        
        ctx.font = '1.2rem Poppins, sans-serif';
        ctx.fillStyle = '#b74b4b';
        ctx.fillText('Score: ' + score, canvas.width/2, canvas.height/2 + 20);
        
        if (score === highScore && score > 0) {
            ctx.fillStyle = '#4caf50';
            ctx.fillText('🎉 New High Score! 🎉', canvas.width/2, canvas.height/2 + 50);
        }
        
        ctx.fillStyle = '#ccc';
        ctx.font = '1rem Poppins, sans-serif';
        ctx.fillText('Press Enter or tap to restart', canvas.width/2, canvas.height/2 + 80);
        return;
    }
    
    if (!gameStarted) return;
    
    moveSnake();
    draw();
    
    // Clear previous timeout before setting new one
    if (gameInterval) {
        clearTimeout(gameInterval);
    }
    // SNAKE SPEED: 400ms delay between moves (lower = faster, higher = slower)
    gameInterval = setTimeout(gameLoop, 400);
}
// Initialize game with error handling
try {
    draw();
    setupControls();
    window.addEventListener('resize', setupControls);
    
    // Start the game immediately
    startGame();
    
    // Make startGame function available globally for the HTML button
    window.startGame = startGame;
} catch (error) {
    console.error('Error initializing game:', error);
}
