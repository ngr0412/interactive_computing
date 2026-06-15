let classifier;
let imageModelURL = 'https://teachablemachine.withgoogle.com/models/ETHqPxtwq/';
let video;
let label = "모델 로딩 중...";


let cols, rows;
let cellSize = 40; 
let player = { x: 1, y: 1 }; 
let destination = { x: 9, y: 9 }; 

// 간단한 11x11 미로 
let maze = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1],
  [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

// 딜레이
let lastMoveFrame = 0;
let moveInterval = 15; 

// 게임 상태 및 UI 관련 변수
let lives = 3; 
let startTime = 0;
let finalTime = 0; 
let gameIsOver = false;
let gameCleared = false; 
let gameStarted = false; 


let startButton;
let nameInput; 
let currentNickname = "Player";
let rankingList = []; 
let rankingWidth = 160; 

function preload() {
  classifier = ml5.imageClassifier(imageModelURL + 'model.json');
}

function setup() {
  createCanvas(600, 600); 
  
  video = createCapture(VIDEO);
  video.size(160, 120);
  video.hide();

  classifyVideo();
  
  cols = maze[0].length;
  rows = maze.length;

  nameInput = createInput('');
  nameInput.attribute('placeholder', '닉네임 입력');
  nameInput.size(120, 25);
  nameInput.style('text-align', 'center');
  
  startButton = createButton('START GAME');
  setUIElementsPosition(); 
  startButton.mousePressed(startGame);
}

function startGame() {
  currentNickname = nameInput.value().trim();
  if (currentNickname === "") {
    currentNickname = "Player";
  }

  player = { x: 1, y: 1 };
  lives = 3;
  gameIsOver = false;
  gameCleared = false;
  gameStarted = true;
  startTime = millis(); 
  
  nameInput.hide();
  startButton.hide();   
  loop();               
}

function draw() {
  background(240);

  // 랭킹
  fill(34, 40, 49); 
  noStroke();
  rect(0, 0, rankingWidth, height);
  
  fill(255, 211, 105);
  textSize(18);
  textStyle(BOLD);
  textAlign(CENTER, TOP);
  text("🏆 TIME ATTACK", rankingWidth / 2, 20);
  
  stroke(255, 211, 105, 100);
  strokeWeight(1);
  line(15, 45, rankingWidth - 15, 45);
  noStroke();

  textSize(13);
  textStyle(NORMAL);
  textAlign(LEFT, TOP);
  for (let i = 0; i < min(rankingList.length, 10); i++) {
    if (i === 0) fill(255, 215, 0);       
    else if (i === 1) fill(211, 211, 211); 
    else if (i === 2) fill(205, 127, 50);  
    else fill(238, 238, 238);              
    
    let rankText = (i + 1) + ". " + rankingList[i].name;
    let timeText = rankingList[i].time.toFixed(1) + "초";
    
    text(rankText, 15, 65 + (i * 30));
    textAlign(RIGHT, TOP);
    text(timeText, rankingWidth - 15, 65 + (i * 30));
    textAlign(LEFT, TOP); 
  }

  // 게임
  push();
  translate(rankingWidth, 0); 

  // 1. 미로 그리기
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let x = j * cellSize;
      let y = i * cellSize;
      
      if (maze[i][j] === 1) {
        fill(40, 44, 52); 
        noStroke();
        rect(x, y, cellSize, cellSize);
      } else {
        fill(255); 
        stroke(230);
        rect(x, y, cellSize, cellSize);
      }
    }
  }

  // 2. 목적지 그리기
  fill(0, 200, 100);
  rect(destination.x * cellSize + 5, destination.y * cellSize + 5, cellSize - 10, cellSize - 10, 5);

  // 3. 플레이어 그리기
  if (gameStarted && !gameIsOver && !gameCleared) {
    fill(255, 50, 50); 
    noStroke();
    ellipse(player.x * cellSize + cellSize / 2, player.y * cellSize + cellSize / 2, cellSize * 0.6);
  }

  // 4. 하단 레이아웃
  push();
  translate(0, rows * cellSize + 10);
  
  push();
  translate(160, 0); 
  scale(-1, 1);      
  image(video, 0, 0, 140, 105);
  pop();
  
  fill(0);
  noStroke();
  textSize(14);
  textAlign(LEFT, TOP);
  text("플레이어: " + currentNickname, 180, 5);
  text("인식된 동작:", 180, 25);
  
  textSize(22);
  textStyle(BOLD);
  fill(0, 102, 204);
  text(label, 180, 46);
  
  if (gameStarted && !gameIsOver && !gameCleared) {
    let elapsedTime = (millis() - startTime) / 1000;
    fill(100);
    textSize(12);
    textStyle(NORMAL);
    text("⏱️ 플레이 시간: " + nf(elapsedTime, 0, 1) + "초", 180, 78);
    text("⏳ 하트 감소까지: " + nf(40 - (elapsedTime % 40), 0, 1) + "초", 180, 94);
  }
  pop();

  // 5. 40초 타이머
  if (gameStarted && !gameIsOver && !gameCleared) {
    let passedTime = millis() - startTime;
    
    if (passedTime >= 120000 && lives > 0) lives = 0;
    else if (passedTime >= 80000 && lives > 1) lives = 1;
    else if (passedTime >= 40000 && lives > 2) lives = 2;
    
    if (lives <= 0) {
      gameIsOver = true;
    }
  }

  // 6. 하트 3개 드로잉
  push();
  translate(20, height - 35); 
  for (let h = 0; h < 3; h++) {
    if (h < lives) fill(255, 50, 50); 
    else fill(240); 
    stroke(255); 
    strokeWeight(2.5);
    drawHeart(h * 35, 0, 17); 
  }
  pop();

  // 7. 플레이어 이동
  if (gameStarted && !gameIsOver && !gameCleared && (frameCount - lastMoveFrame > moveInterval)) {
    movePlayer();
  }

  // 8. 게임 클리어
  if (gameStarted && !gameIsOver && !gameCleared && player.x === destination.x && player.y === destination.y) {
    gameCleared = true;
    finalTime = (millis() - startTime) / 1000; 
    rankingList.push({ name: currentNickname, time: finalTime });
    rankingList.sort((a, b) => a.time - b.time);
  }

  // 9. 최종 승리
  if (gameCleared) {
    fill(0, 0, 0, 160);
    rect(0, 0, cols * cellSize, rows * cellSize);
    
    fill(255, 215, 0);
    textSize(36);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    text("🎉 탈출 성공! 🎉", (cols * cellSize) / 2, (rows * cellSize) / 2 - 25);
    
    fill(255);
    textSize(18);
    textStyle(NORMAL);
    text("기록: " + finalTime.toFixed(1) + "초", (cols * cellSize) / 2, (rows * cellSize) / 2 + 20);
    
    startButton.html('PLAY AGAIN');
    nameInput.show();
    startButton.show();
    noLoop();
  }

  // 10. 다시시작 버튼 
  if (gameIsOver) {
    fill(0, 0, 0, 200);
    rect(0, 0, cols * cellSize, rows * cellSize);
    
    fill(255, 50, 50);
    textSize(40);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    text("GAME OVER", (cols * cellSize) / 2, (rows * cellSize) / 2 - 20);
    
    textSize(15);
    fill(200);
    textStyle(NORMAL);
    text("시간 초과로 패배했습니다.", (cols * cellSize) / 2, (rows * cellSize) / 2 + 25);
    
    startButton.html('RESTART GAME');
    nameInput.show();
    startButton.show();
    noLoop(); 
  }
  
  pop(); 
}


function classifyVideo() {
  classifier.classify(video, gotResult);
}

function gotResult(param1, param2) {
  let errors = null;
  let results = null;

  if (param1 instanceof Error) {
    errors = param1;
    results = param2;
  } else if (param2 instanceof Error) {
    errors = param2;
    results = param1;
  } else {
    results = param1;
    errors = param2;
  }

  if (errors) {
    console.error(errors);
    return;
  }
  
  if (results) {
    if (Array.isArray(results) && results.length > 0) {
      label = results[0].label;
    } else if (results.label) {
      label = results.label;
    } else if (typeof results === 'string') {
      label = results;
    }
  }
  classifyVideo();
}

function movePlayer() {
  let targetX = player.x;
  let targetY = player.y;

  if (label === "오른쪽") targetX++;
  else if (label === "왼쪽") targetX--;
  else if (label === "위") targetY--;
  else if (label === "아래") targetY++;

  if (targetX >= 0 && targetX < cols && targetY >= 0 && targetY < rows) {
    if (maze[targetY][targetX] === 0) {
      player.x = targetX;
      player.y = targetY;
      lastMoveFrame = frameCount; 
    }
  }
}

function drawHeart(x, y, size) {
  push();
  translate(x, y - size/4);
  beginShape();
  for (let a = 0; a < TWO_PI; a += 0.1) {
    let hx = size * 16 * pow(sin(a), 3) / 16;
    let hy = -size * (13 * cos(a) - 5 * cos(2*a) - 2 * cos(3*a) - cos(4*a)) / 16;
    vertex(hx, hy);
  }
  endShape(CLOSE);
  pop();
}

function setUIElementsPosition() {
  let centerGameX = rankingWidth + (cols * cellSize) / 2;
  let centerGameY = (rows * cellSize) / 2;

  nameInput.position(centerGameX - 65, centerGameY - 25);
  startButton.position(centerGameX - 65, centerGameY + 15);
  
  startButton.size(130, 40);
  startButton.style('background-color', '#ff3232');
  startButton.style('color', '#ffffff');
  startButton.style('font-weight', 'bold');
  startButton.style('border-radius', '6px');
  startButton.style('border', 'none');
  startButton.style('cursor', 'pointer');
}