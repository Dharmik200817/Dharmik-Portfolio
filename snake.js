const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const box = 20;
let snake = [{x: 9*box, y: 10*box}];
let direction = 'RIGHT'; // Start moving right automatically
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

function startGame() {
    gameStarted = true;
    document.getElementById('gameOverlay').style.display = 'none';
    resetGame();
}

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
    // Remove all existing event listeners
    document.body.ontouchstart = null;
    document.body.ontouchmove = null;
    document.body.ontouchend = null;
    canvas.ontouchstart = null;
    canvas.ontouchmove = null;
    canvas.ontouchend = null;
    canvas.onmousedown = null;

    // Always use full screen touch controls for mobile
    if (isMobile()) {
        document.body.style.touchAction = 'none'; // Prevent scrolling
        document.body.addEventListener('touchstart', handleTouchStart, {passive: false});
        document.body.addEventListener('touchmove', handleTouchMove, {passive: false});
        document.body.addEventListener('touchend', function(e) {
            e.preventDefault();
            if (gameOver) resetGame();
        }, {passive: false});
    } else {
        // Desktop controls - canvas only
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

// Arrow key controls
document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
    if (e.key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
    if (e.key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
    if (e.key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
});

function drawSnake() {
    if (snake.length === 0) return;
    
    // Draw the snake body as a continuous path
    const radius = box / 2 - 2;
    
    // Create continuous body path
    ctx.beginPath();
    ctx.lineWidth = box - 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Create gradient for the snake body
    const bodyGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    bodyGradient.addColorStop(0, '#8bc34a');
    bodyGradient.addColorStop(0.3, '#689f38');
    bodyGradient.addColorStop(0.7, '#4e7c31');
    bodyGradient.addColorStop(1, '#388e3c');
    
    ctx.strokeStyle = bodyGradient;
    
    // Start from the tail and draw continuous path
    for (let i = snake.length - 1; i >= 0; i--) {
        const segment = snake[i];
        const x = segment.x + box/2;
        const y = segment.y + box/2;
        
        if (i === snake.length - 1) {
            // Start from tail
            ctx.moveTo(x, y);
        } else {
            // Draw smooth curve to next segment
            const prevSegment = snake[i + 1];
            const prevX = prevSegment.x + box/2;
            const prevY = prevSegment.y + box/2;
            
            // Use quadratic curve for smoother connections
            const midX = (x + prevX) / 2;
            const midY = (y + prevY) / 2;
            ctx.quadraticCurveTo(prevX, prevY, midX, midY);
            ctx.lineTo(x, y);
        }
    }
    
    ctx.stroke();
    
    // Draw border for depth
    ctx.beginPath();
    ctx.lineWidth = box - 1;
    ctx.strokeStyle = '#1b5e20';
    
    for (let i = snake.length - 1; i >= 0; i--) {
        const segment = snake[i];
        const x = segment.x + box/2;
        const y = segment.y + box/2;
        
        if (i === snake.length - 1) {
            ctx.moveTo(x, y);
        } else {
            const prevSegment = snake[i + 1];
            const prevX = prevSegment.x + box/2;
            const prevY = prevSegment.y + box/2;
            
            const midX = (x + prevX) / 2;
            const midY = (y + prevY) / 2;
            ctx.quadraticCurveTo(prevX, prevY, midX, midY);
            ctx.lineTo(x, y);
        }
    }
    
    ctx.stroke();
    
    // Draw the head separately for better definition
    const head = snake[0];
    const headX = head.x + box/2;
    const headY = head.y + box/2;
    
    // Head gradient
    const headGradient = ctx.createRadialGradient(headX - radius*0.3, headY - radius*0.3, 0, headX, headY, radius);
    headGradient.addColorStop(0, '#8bc34a');
    headGradient.addColorStop(0.6, '#689f38');
    headGradient.addColorStop(1, '#388e3c');
    
    ctx.fillStyle = headGradient;
    ctx.beginPath();
    ctx.arc(headX, headY, radius, 0, 2 * Math.PI);
    ctx.fill();
    
    // Head border
    ctx.strokeStyle = '#1b5e20';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Add some shine to the head
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.beginPath();
    ctx.arc(headX - radius*0.3, headY - radius*0.3, radius*0.4, 0, 2 * Math.PI);
    ctx.fill();
    
    // Simple dot eyes
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(headX - box*0.15, headY - box*0.15, 2, 0, 2*Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(headX + box*0.15, headY - box*0.15, 2, 0, 2*Math.PI);
    ctx.fill();
}

function drawApple() {
    const centerX = apple.x + box/2;
    const centerY = apple.y + box/2;
    const radius = box/2 - 2;
    
    // Apple gradient
    const appleGradient = ctx.createRadialGradient(centerX - radius*0.3, centerY - radius*0.3, 0, centerX, centerY, radius);
    appleGradient.addColorStop(0, '#ff5722');
    appleGradient.addColorStop(0.6, '#e64a19');
    appleGradient.addColorStop(1, '#d84315');
    
    ctx.fillStyle = appleGradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2*Math.PI);
    ctx.fill();
    
    // Apple border
    ctx.strokeStyle = '#bf360c';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Apple shine
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.beginPath();
    ctx.ellipse(centerX - radius*0.3, centerY - radius*0.4, radius*0.3, radius*0.4, -0.5, 0, 2*Math.PI);
    ctx.fill();
    
    // Apple stem
    ctx.strokeStyle = '#4e7c31';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX, apple.y + 2);
    ctx.lineTo(centerX, apple.y - 2);
    ctx.stroke();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSnake();
    drawApple();
}

function moveSnake() {
    // Snake always moves in the current direction
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
    direction = 'RIGHT'; // Start moving right automatically
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
    document.getElementById('gameOverlay').style.display = 'none';
    draw();
    clearTimeout(gameInterval);
    setTimeout(gameLoop, 400);
}

function gameLoop() {
    if (gameOver) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 2rem Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over!', canvas.width/2, canvas.height/2 - 20);
        
        ctx.font = 'bold 1.2rem Arial, sans-serif';
        ctx.fillStyle = '#b74b4b';
        ctx.fillText('Score: ' + score, canvas.width/2, canvas.height/2 + 20);
        
        if (score === highScore && score > 0) {
            ctx.fillStyle = '#4caf50';
            ctx.fillText('🎉 New High Score! 🎉', canvas.width/2, canvas.height/2 + 50);
        }
        
        ctx.fillStyle = '#ccc';
        ctx.font = '1rem Arial, sans-serif';
        ctx.fillText('Tap to restart', canvas.width/2, canvas.height/2 + 80);
        return;
    }
    
    if (!gameStarted) return;
    
    moveSnake();
    draw();
    
    // Dynamic speed based on snake length
    const gameSpeed = Math.max(120, 200 - (snake.length * 5));
    gameInterval = setTimeout(gameLoop, gameSpeed);
}
// Initialize game
draw();
setupControls();
window.addEventListener('resize', setupControls);

// Make startGame function globally available
window.startGame = startGame;
