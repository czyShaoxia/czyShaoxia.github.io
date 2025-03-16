// 游戏数据
const gameData = {
    players: {
        you: { name: '你', coins: 100, betHorse: null, betAmount: 0 },
        playerA: { name: '玩家A', coins: 100, betHorse: null, betAmount: 0 },
        playerB: { name: '玩家B', coins: 100, betHorse: null, betAmount: 0 },
        playerC: { name: '玩家C', coins: 100, betHorse: null, betAmount: 0 }
    },
    horses: [
        { name: '踏雪无痕', id: 0, position: 0, speed: 0, track: 1 },
        { name: '风驰电掣', id: 1, position: 0, speed: 0, track: 2 },
        { name: '龙腾四海', id: 2, position: 0, speed: 0, track: 3 },
        { name: '云起龙骧', id: 3, position: 0, speed: 0, track: 4 }
    ],
    raceInProgress: false,
    raceFinished: false,
    winner: null,
    finishPosition: 0
};

// DOM 元素
const elements = {
    horseSelect: document.getElementById('horse-select'),
    betAmount: document.getElementById('bet-amount'),
    placeBetBtn: document.getElementById('place-bet-btn'),
    startRaceBtn: document.getElementById('start-race-btn'),
    nextRaceBtn: document.getElementById('next-race-btn'),
    betDetails: document.getElementById('bet-details'),
    raceResult: document.getElementById('race-result'),
    winnerText: document.getElementById('winner-text'),
    resultDetails: document.getElementById('result-details'),
    yourCoins: document.getElementById('your-coins'),
    playerACoins: document.getElementById('player-a-coins'),
    playerBCoins: document.getElementById('player-b-coins'),
    playerCCoins: document.getElementById('player-c-coins'),
    horses: [
        document.getElementById('horse-1'),
        document.getElementById('horse-2'),
        document.getElementById('horse-3'),
        document.getElementById('horse-4')
    ]
};

// 初始化游戏
function initGame() {
    updateCoinsDisplay();
    elements.placeBetBtn.addEventListener('click', placeBet);
    elements.startRaceBtn.addEventListener('click', startRace);
    elements.nextRaceBtn.addEventListener('click', resetRace);
    elements.betAmount.addEventListener('input', validateBetAmount);
}

// 验证下注金额
function validateBetAmount() {
    const amount = parseInt(elements.betAmount.value);
    const maxCoins = gameData.players.you.coins;
    
    if (isNaN(amount) || amount <= 0) {
        elements.betAmount.value = 1;
    } else if (amount > maxCoins) {
        elements.betAmount.value = maxCoins;
    }
}

// 更新金币显示
function updateCoinsDisplay() {
    elements.yourCoins.textContent = gameData.players.you.coins;
    elements.playerACoins.textContent = gameData.players.playerA.coins;
    elements.playerBCoins.textContent = gameData.players.playerB.coins;
    elements.playerCCoins.textContent = gameData.players.playerC.coins;
}

// 玩家下注
function placeBet() {
    const selectedHorse = parseInt(elements.horseSelect.value);
    const betAmount = parseInt(elements.betAmount.value);
    
    if (isNaN(betAmount) || betAmount <= 0 || betAmount > gameData.players.you.coins) {
        alert('请输入有效的下注金额！');
        return;
    }
    
    // 玩家下注
    gameData.players.you.betHorse = selectedHorse;
    gameData.players.you.betAmount = betAmount;
    
    // NPC下注
    npcBet();
    
    // 显示下注信息
    displayBetInfo();
    
    // 启用开始比赛按钮
    elements.placeBetBtn.disabled = true;
    elements.startRaceBtn.disabled = false;
}

// NPC下注
function npcBet() {
    const npcs = ['playerA', 'playerB', 'playerC'];
    
    npcs.forEach(npc => {
        const player = gameData.players[npc];
        
        // 随机选择马匹
        const randomHorse = Math.floor(Math.random() * 4);
        
        // 随机下注金额 (10% - 50% 的金币)
        const minBet = Math.max(1, Math.floor(player.coins * 0.1));
        const maxBet = Math.floor(player.coins * 0.5);
        const randomBet = Math.floor(Math.random() * (maxBet - minBet + 1)) + minBet;
        
        player.betHorse = randomHorse;
        player.betAmount = randomBet;
    });
}

// 显示下注信息
function displayBetInfo() {
    let betInfoHTML = '';
    
    for (const playerKey in gameData.players) {
        const player = gameData.players[playerKey];
        if (player.betHorse !== null) {
            const horseName = gameData.horses[player.betHorse].name;
            betInfoHTML += `<p>${player.name} 下注了 ${player.betAmount} 金币在 ${horseName} 上</p>`;
        }
    }
    
    elements.betDetails.innerHTML = betInfoHTML;
}

// 开始比赛
function startRace() {
    gameData.raceInProgress = true;
    gameData.raceFinished = false;
    gameData.winner = null;
    gameData.finishPosition = 0;
    
    // 重置马匹位置
    gameData.horses.forEach((horse, index) => {
        horse.position = 0;
        horse.speed = 0;
        elements.horses[index].style.left = '0px';
    });
    
    // 禁用按钮
    elements.startRaceBtn.disabled = true;
    
    // 隐藏结果
    elements.raceResult.classList.add('hidden');
    
    // 开始动画
    requestAnimationFrame(updateRace);
}

// 更新比赛
function updateRace() {
    if (!gameData.raceInProgress) return;
    
    const trackWidth = document.querySelector('.track').offsetWidth - 40; // 减去马匹宽度
    let allFinished = true;
    
    // 更新每匹马的位置
    gameData.horses.forEach((horse, index) => {
        if (horse.position >= trackWidth) {
            // 马已经到达终点
            horse.position = trackWidth;
        } else {
            // 马还在跑
            allFinished = false;
            
            // 随机加速度
            const acceleration = Math.random() * 0.5 - 0.1; // -0.1 到 0.4 之间的随机加速度
            
            // 更新速度 (有一个最大速度限制)
            horse.speed = Math.max(0, Math.min(horse.speed + acceleration, 8));
            
            // 更新位置
            horse.position += horse.speed;
            
            // 检查是否到达终点
            if (horse.position >= trackWidth && gameData.winner === null) {
                gameData.winner = index;
                gameData.finishPosition = 1;
            }
        }
        
        // 更新 DOM
        elements.horses[index].style.left = `${horse.position}px`;
    });
    
    if (allFinished) {
        // 比赛结束
        gameData.raceInProgress = false;
        gameData.raceFinished = true;
        
        // 计算结果
        calculateResults();
        
        // 显示结果
        displayResults();
    } else {
        // 继续动画
        requestAnimationFrame(updateRace);
    }
}

// 计算比赛结果
function calculateResults() {
    // 更新玩家金币
    for (const playerKey in gameData.players) {
        const player = gameData.players[playerKey];
        
        if (player.betHorse === gameData.winner) {
            // 赢了，获得双倍下注金额
            player.coins += player.betAmount;
        } else {
            // 输了，失去下注金额
            player.coins -= player.betAmount;
        }
    }
    
    // 更新显示
    updateCoinsDisplay();
}

// 显示比赛结果
function displayResults() {
    const winnerHorse = gameData.horses[gameData.winner];
    elements.winnerText.textContent = `获胜者: ${winnerHorse.name}`;
    
    let resultHTML = '<h3>下注结果:</h3>';
    
    for (const playerKey in gameData.players) {
        const player = gameData.players[playerKey];
        const horseName = gameData.horses[player.betHorse].name;
        
        if (player.betHorse === gameData.winner) {
            resultHTML += `<p>${player.name} 在 ${horseName} 上赢得了 ${player.betAmount} 金币!</p>`;
        } else {
            resultHTML += `<p>${player.name} 在 ${horseName} 上输掉了 ${player.betAmount} 金币。</p>`;
        }
    }
    
    elements.resultDetails.innerHTML = resultHTML;
    elements.raceResult.classList.remove('hidden');
}

// 重置比赛
function resetRace() {
    // 重置下注
    for (const playerKey in gameData.players) {
        const player = gameData.players[playerKey];
        player.betHorse = null;
        player.betAmount = 0;
    }
    
    // 重置马匹
    gameData.horses.forEach((horse, index) => {
        horse.position = 0;
        horse.speed = 0;
        elements.horses[index].style.left = '0px';
    });
    
    // 重置界面
    elements.betDetails.innerHTML = '';
    elements.raceResult.classList.add('hidden');
    elements.placeBetBtn.disabled = false;
    elements.startRaceBtn.disabled = true;
    
    // 检查游戏是否结束
    checkGameOver();
}

// 检查游戏是否结束
function checkGameOver() {
    // 检查玩家是否还有金币
    if (gameData.players.you.coins <= 0) {
        setTimeout(() => {
            alert('游戏结束！你的金币已经用完了。');
            resetGame();
        }, 500);
        return;
    }
    
    // 检查NPC是否都没有金币了
    const allNPCsBroke = ['playerA', 'playerB', 'playerC'].every(npc => gameData.players[npc].coins <= 0);
    
    if (allNPCsBroke) {
        setTimeout(() => {
            alert('恭喜你！你赢得了所有NPC的金币！');
            resetGame();
        }, 500);
    }
}

// 重置游戏
function resetGame() {
    // 重置所有玩家金币
    for (const playerKey in gameData.players) {
        gameData.players[playerKey].coins = 100;
        gameData.players[playerKey].betHorse = null;
        gameData.players[playerKey].betAmount = 0;
    }
    
    // 更新显示
    updateCoinsDisplay();
    elements.betDetails.innerHTML = '';
    elements.raceResult.classList.add('hidden');
    elements.placeBetBtn.disabled = false;
    elements.startRaceBtn.disabled = true;
}

// 初始化游戏
document.addEventListener('DOMContentLoaded', initGame); 