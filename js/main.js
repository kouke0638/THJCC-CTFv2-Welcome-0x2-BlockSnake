// 監聽網頁載入，讓遊戲容器有進場動畫
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('snake-game-container').classList.add('show');
    }, 200);
});

// 將主要遊戲功能封裝在立即執行函式中，避免汙染全域命名空間
(function(){
    const GRID_WIDTH = 20;   // 貪吃蛇的網格寬度 (x)
    const GRID_HEIGHT = 6;   // 貪吃蛇的網格高度 (y)
    const CELL_SIZE = 20;    // 每個網格的像素尺寸
    let snake = [{x: 10, y: 3}];
    let food = {x: 15, y: 3};
    let direction = {x: 1, y: 0};
    let score = 0;
    let gameInterval;
    let isGameRunning = false;
    let failCount = 0;
    let countdownInterval;
    
    // 預設 Flag (可自行修改)
    const _0x1a2b3c = "THJCC{Sn4ke_G4me_Mast3r}";

    // 倒數計時函式
    function startCountdown(seconds, callback) {
        const overlay = document.querySelector('.countdown-overlay');
        const countdownText = overlay.querySelector('.countdown-text');
        overlay.style.display = 'flex';
        
        setTimeout(() => {
            overlay.classList.add('active');
        }, 0);

        let count = seconds;
        countdownText.textContent = count;

        countdownInterval = setInterval(() => {
            count--;
            if (count > 0) {
                countdownText.textContent = count;
            } else {
                clearInterval(countdownInterval);
                overlay.classList.remove('active');
                setTimeout(() => {
                    overlay.style.display = 'none';
                    if (callback) callback();
                }, 300);
            }
        }, 1000);
    }

    // 遊戲開始
    window.startGame = function() {
        if (isGameRunning) {
            // 如果遊戲正在進行，就直接重新載入以達到重開效果
            location.reload();
            return;
        }
        
        const overlay = document.querySelector('.game-over-overlay');
        const gameOver = document.getElementById('game-over');
        
        overlay.style.opacity = '0';
        gameOver.style.opacity = '0';
        
        setTimeout(() => {
            overlay.style.display = 'none';
            gameOver.style.display = 'none';
        }, 500);
        
        const button = document.getElementById('snake-game-button');
        button.innerHTML = '<i class="fas fa-redo"></i> Restart';
        button.disabled = true;
        
        snake = [{x: 10, y: 3}];
        direction = {x: 1, y: 0};
        score = 0;
        updateScore();
        generateFood();
        drawGame();
        
        // 開始倒數
        startCountdown(3, () => {
            isGameRunning = true;
            button.disabled = false;
            gameInterval = setInterval(gameLoop, 150);
        });
    }

    // 遊戲主迴圈
    function gameLoop() {
        const newHead = {
            x: snake[0].x + direction.x,
            y: snake[0].y + direction.y
        };

        // 邊界檢查
        if (newHead.x < 0 || newHead.x >= GRID_WIDTH || 
            newHead.y < 0 || newHead.y >= GRID_HEIGHT) {
            gameOver();
            return;
        }

        // 撞到自己身體檢查
        for (let part of snake) {
            if (newHead.x === part.x && newHead.y === part.y) {
                gameOver();
                return;
            }
        }

        // 移動
        snake.unshift(newHead);

        // 吃食物
        if (newHead.x === food.x && newHead.y === food.y) {
            score += 10;
            updateScore();

            // 當分數達到 10000，顯示 Flag
            if (score === 10000) {
                const flagElement = document.getElementById('flag');
                flagElement.innerHTML = _0x1a2b3c;
                flagElement.style.display = 'block';
                flagElement.addEventListener('click', async () => {
                    try {
                        await navigator.clipboard.writeText(_0x1a2b3c);
                        const tooltip = document.querySelector('.copied-tooltip');
                        tooltip.style.display = 'block';
                        setTimeout(() => {
                            tooltip.style.display = 'none';
                        }, 1500);
                    } catch (err) {
                        console.error('複製失敗:', err);
                    }
                });
            }
            generateFood();
        } else {
            // 沒吃到食物就移除尾巴
            snake.pop();
        }

        drawGame();
    }

    // 隨機產生食物位置
    function generateFood() {
        food = {
            x: Math.floor(Math.random() * GRID_WIDTH),
            y: Math.floor(Math.random() * GRID_HEIGHT)
        };
        // 避免食物出現在蛇身上
        while (snake.some(part => part.x === food.x && part.y === food.y)) {
            food = {
                x: Math.floor(Math.random() * GRID_WIDTH),
                y: Math.floor(Math.random() * GRID_HEIGHT)
            };
        }
    }

    // 繪製貪吃蛇與食物
    function drawGame() {
        const board = document.getElementById('game-board');
        board.innerHTML = '';
        
        // 蛇身
        snake.forEach((part, index) => {
            const snakePart = document.createElement('div');
            snakePart.className = 'snake-part';
            snakePart.style.left = part.x * CELL_SIZE + 'px';
            snakePart.style.top = part.y * CELL_SIZE + 'px';
            if (index === 0) {
                snakePart.style.zIndex = '2';
            }
            board.appendChild(snakePart);
        });

        // 食物
        const foodElement = document.createElement('div');
        foodElement.className = 'food';
        foodElement.style.left = food.x * CELL_SIZE + 'px';
        foodElement.style.top = food.y * CELL_SIZE + 'px';
        board.appendChild(foodElement);
    }

    // 更新分數
    function updateScore() {
        document.getElementById('score').textContent = score;
    }

    // 遊戲結束
    function gameOver() {
        clearInterval(gameInterval);
        clearInterval(countdownInterval);
        isGameRunning = false;
        failCount++;
        
        document.getElementById('final-score').textContent = score;
        
        const overlay = document.querySelector('.game-over-overlay');
        const gameOver = document.getElementById('game-over');
        
        overlay.style.display = 'block';
        gameOver.style.display = 'block';
        
        // 觸發漸進顯示
        overlay.offsetHeight; // 強制重繪
        overlay.style.opacity = '1';
        gameOver.style.opacity = '1';
        
        // 顯示震動動畫
        const gameBoard = document.getElementById('game-board');
        gameBoard.style.animation = 'shake 0.5s ease';
        setTimeout(() => {
            gameBoard.style.animation = '';
        }, 500);

        // 重置 Game Over 動畫
        const gameOverText = document.querySelector('.game-over-text');
        const gameOverSubtitle = document.querySelector('.game-over-subtitle');
        gameOverText.style.animation = 'none';
        gameOverSubtitle.style.animation = 'none';
        gameOverText.offsetHeight;     // 強制重繪
        gameOverSubtitle.offsetHeight; // 強制重繪
        gameOverText.style.animation = 'slideIn 0.5s ease forwards';
        gameOverSubtitle.style.animation = 'fadeIn 0.5s ease forwards';
        gameOverSubtitle.style.animationDelay = '0.3s';

        // 連續失敗等待時間 (越多次失敗等待時間越長，但上限 10 秒)
        const waitTime = Math.min(failCount * 2, 10);
        let timeLeft = waitTime;
        const button = document.getElementById('snake-game-button');
        button.disabled = true;

        function updateCountdown() {
            if (timeLeft > 0) {
                gameOverSubtitle.innerHTML = `Final Score: <span id="final-score">${score}</span><br>Restart in ${timeLeft} seconds...`;
                timeLeft--;
                setTimeout(updateCountdown, 1000);
            } else {
                button.disabled = false;
                gameOverSubtitle.innerHTML = `Final Score: <span id="final-score">${score}</span>`;
                overlay.style.opacity = '0';
                gameOver.style.opacity = '0';
                setTimeout(() => {
                    overlay.style.display = 'none';
                    gameOver.style.display = 'none';
                    overlay.style.opacity = '';
                    gameOver.style.opacity = '';
                }, 500);
            }
        }
        updateCountdown();
    }

    // 鍵盤事件監聽
    document.addEventListener('keydown', (event) => {
        if (!isGameRunning) return;
        
        const keyMap = {
            'ArrowUp':    {x: 0,  y: -1},
            'ArrowDown':  {x: 0,  y: 1},
            'ArrowLeft':  {x: -1, y: 0},
            'ArrowRight': {x: 1,  y: 0},
            'w':          {x: 0,  y: -1},
            's':          {x: 0,  y: 1},
            'a':          {x: -1, y: 0},
            'd':          {x: 1,  y: 0}
        };

        const newDirection = keyMap[event.key];
        if (newDirection) {
            // 避免直接向反方向移動
            if (!(direction.x === -newDirection.x && direction.y === -newDirection.y)) {
                direction = newDirection;
            }
        }
    });
})();

// 禁止 F12、Ctrl+Shift+I、Ctrl+U、右鍵選單
document.onkeydown = function(e) {
    if(e.keyCode === 123) { // F12
        return false;
    }
    if(e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74)) {
        return false;
    }
    if(e.ctrlKey && e.keyCode === 85) { // Ctrl+U
        return false;
    }
};
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

// 在 console 中清除訊息，阻止某些人直接看 console (僅擾亂用途)
(function() {
    let warning = 'bad bad';
    console.log(warning);
    console.clear();
})();
