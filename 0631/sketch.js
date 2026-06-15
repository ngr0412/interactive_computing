let faceMesh;
let handPose;
let video;
let faces = [];
let hands = [];
let drawingLayer;

let happyGauge = 0;
let sadGauge = 0;
let angryGauge = 0;

let drawColor;
let brushSize = 8;

let prevX = null;
let prevY = null;
let eraserMode = false;

let videoWidth = 320;   
let videoHeight = 240;  
let boardWidth = 640;   
let boardHeight = 480;  


let faceOptions = {
	maxFaces: 1,
	refineLandmarks: true, 
	flipped: false
};

let handOptions = {
	maxHands: 1,
	flipped: false
};

let missions = [
	{ 
		text: "🍳 미션 1: 달걀 후라이 (가운데 노란색 🟡 + 바깥쪽 파란색 🔵)", 
		checks: [
			{ x: 320, y: 240, r: 235, g: 190, b: 0, label: "노른자 자리" },   
			{ x: 200, y: 240, r: 0, g: 120, b: 255, label: "왼쪽 흰자" },    
			{ x: 440, y: 240, r: 0, g: 120, b: 255, label: "오른쪽 흰자" }   
		]
	},
	{ 
		text: "🌋 미션 2: 폭발하는 화산 (위쪽 빨간색 🔴 + 아래쪽 파란색 🔵)", 
		checks: [
			{ x: 320, y: 120, r: 255, g: 0, b: 0, label: "용암 분출구" },   
			{ x: 220, y: 380, r: 0, g: 120, b: 255, label: "왼쪽 산등성이" },
			{ x: 420, y: 380, r: 0, g: 120, b: 255, label: "오른쪽 산등성이" }
		]
	}
];

let currentMissionIndex = 0;
let missionSuccessTime = 0;    
let isMissionCleared = false;  

function preload() {
	faceMesh = ml5.faceMesh(faceOptions);
	handPose = ml5.handPose(handOptions);
}

function setup() {
	createCanvas(videoWidth + boardWidth, boardHeight);
	
	video = createCapture(VIDEO);
	video.size(640, 480); 
	video.hide();

	drawingLayer = createGraphics(boardWidth, boardHeight);
	drawingLayer.clear();

	faceMesh.detectStart(video, gotFaces);
	handPose.detectStart(video, gotHands);

	drawColor = color(0); 
}

function gotFaces(results) { 
	faces = results; 
}

function gotHands(results) { 
	hands = results; 
}

function draw() {
	background(240);  

	image(video, 0, 0, videoWidth, videoHeight);
	
	fill(220);
	noStroke();
	rect(0, videoHeight, videoWidth, height - videoHeight);

	detectEmotion();    
	drawEmotionBars();  

	if (isMissionCleared) {
		fill(230, 255, 230); 
	} else {
		fill(255);
	}
	stroke(200);
	strokeWeight(2);
	rect(videoWidth, 0, boardWidth, boardHeight);

	image(drawingLayer, videoWidth, 0);

	drawMissionGuides();
	drawWithFinger();
	drawAura();         
	drawModeText();     
	drawMissionUI();
	
	if (!isMissionCleared) {
		checkMissionPixels();
	}

	if (isMissionCleared && millis() - missionSuccessTime > 3000) {
		nextMission();
	}
}

function detectEmotion() {
	if (!faces || faces.length === 0) return;


	let face = faces[0];
	let keypoints = face.keypoints;
	if (!keypoints) return;

	let leftMouth = keypoints[61];
	let rightMouth = keypoints[291];
	let upperLip = keypoints[13];
	let lowerLip = keypoints[14];

	if (!leftMouth || !rightMouth || !upperLip || !lowerLip) return;

	let mouthWidth = dist(leftMouth.x, leftMouth.y, rightMouth.x, rightMouth.y);
	let mouthOpen = dist(upperLip.x, upperLip.y, lowerLip.x, lowerLip.y);

	if (mouthWidth > 65) { happyGauge += 2; } else { happyGauge -= 1; }
	if (leftMouth.y > upperLip.y + 2 && rightMouth.y > upperLip.y + 2) { sadGauge += 2; } else { sadGauge -= 1; }
	if (mouthOpen > 25) { angryGauge += 4; } else { angryGauge -= 1; }

	happyGauge = constrain(happyGauge, 0, 100);
	sadGauge = constrain(sadGauge, 0, 100);
	angryGauge = constrain(angryGauge, 0, 100);

	drawColor = color(0); 
	brushSize = 8;

	if (happyGauge > 50) {
		drawColor = color(235, 190, 0); 
		brushSize = 14;
	} else if (sadGauge > 50) {
		drawColor = color(0, 120, 255);
		brushSize = 8; 
	} else if (angryGauge > 50) {
		drawColor = color(255, 0, 0);
		brushSize = 20;
	}


	for (let i = 0; i < faces.length; i++) {
		let currentFace = faces[i];
		let points = currentFace.keypoints;
		for (let j = 0; j < points.length; j++) {
			let keypoint = points[j];
			let mappedX = map(keypoint.x, 0, 640, 0, videoWidth);
			let mappedY = map(keypoint.y, 0, 480, 0, videoHeight);
			fill(0, 255, 0);
			noStroke();
			circle(mappedX, mappedY, 2);
		}
	}
}

function checkMissionPixels() {
	let currentMission = missions[currentMissionIndex];
	let allMatch = true;

	for (let i = 0; i < currentMission.checks.length; i++) {
		let chk = currentMission.checks[i];
		let col = drawingLayer.get(chk.x, chk.y); 
		let d = dist(col[0], col[1], col[2], chk.r, chk.g, chk.b);
		
		if (d > 30) {
			allMatch = false;
			break;
		}
	}

	if (allMatch) {
		isMissionCleared = true;
		missionSuccessTime = millis();
	}
}

function drawMissionGuides() {
	if (isMissionCleared) return;

	let currentMission = missions[currentMissionIndex];
	for (let i = 0; i < currentMission.checks.length; i++) {
		let chk = currentMission.checks[i];
		
		fill(chk.r, chk.g, chk.b, 50);
		stroke(chk.r, chk.g, chk.b, 150);
		strokeWeight(1);
		circle(videoWidth + chk.x, chk.y, 40);
		
		fill(100);
		noStroke();
		textSize(11);
		textAlign(CENTER, CENTER);
		text(chk.label, videoWidth + chk.x, chk.y + 30);
	}
	textAlign(LEFT, BASELINE); 
}

function nextMission() {
	currentMissionIndex = (currentMissionIndex + 1) % missions.length; 
	drawingLayer.clear(); 
	isMissionCleared = false;
}

function drawMissionUI() {
	let currentMission = missions[currentMissionIndex];
	
	fill(0, 150);
	noStroke();
	rect(videoWidth + 10, 10, boardWidth - 20, 45, 8);
	
	fill(255);
	textSize(15);
	textAlign(LEFT, CENTER);
	text(currentMission.text, videoWidth + 25, 32);
	
	if (isMissionCleared) {
		fill(46, 204, 113);
		textSize(28);
		textAlign(CENTER, CENTER);
		text("🎉 MISSION CLEAR! 잠시 후 다음 미션으로...", videoWidth + boardWidth/2, boardHeight/2);
	}
	textAlign(LEFT, BASELINE);
}

function drawWithFinger() {
	if (!hands || hands.length === 0 || !hands[0].keypoints) {
		prevX = null;
		prevY = null;
		return;
	}

	let hand = hands[0];
	let isPalmOpen = checkPalmOpen(hand);   
	let isFist = checkFist(hand);           
	let isIndexUp = checkIndexOnly(hand);   

	if (isPalmOpen) {
		drawingLayer.clear();
		prevX = null;
		prevY = null;
		eraserMode = false;
		return; 
	}

	let boardX = null;
	let boardY = null;

	if (isFist) {
		eraserMode = true;
		if (hand.keypoints[9]) {
			boardX = 640 - hand.keypoints[9].x;
			boardY = hand.keypoints[9].y;
		}
	} else if (isIndexUp) {
		eraserMode = false;
		if (hand.keypoints[8]) {
			boardX = 640 - hand.keypoints[8].x;
			boardY = hand.keypoints[8].y;
		}
	} else {
		prevX = null;
		prevY = null;
		return;
	}

	if (boardX === null || boardY === null) return;

	fill(eraserMode ? color(200, 150) : drawColor);
	noStroke();
	circle(boardX + videoWidth, boardY, eraserMode ? 50 : brushSize + 5);

	if (prevX !== null) {
		if (eraserMode) {
			drawingLayer.erase();
			drawingLayer.strokeWeight(60); 
			drawingLayer.line(prevX, prevY, boardX, boardY);
			drawingLayer.noErase();
		} else {
			drawingLayer.stroke(drawColor);
			drawingLayer.strokeWeight(brushSize); 
			drawingLayer.line(prevX, prevY, boardX, boardY);
		}
	}

	prevX = boardX;
	prevY = boardY;
}

function checkIndexOnly(hand) {
	let kp = hand.keypoints;
	if (!kp || kp.length < 21) return false;
	let indexUp = kp[8].y < kp[5].y;
	let thumbFolded = dist(kp[4].x, kp[4].y, kp[2].x, kp[2].y) < 60; 
	let middleFolded = kp[12].y > kp[9].y - 10;
	let ringFolded = kp[16].y > kp[13].y - 10;
	let pinkyFolded = kp[20].y > kp[17].y - 10;
	return indexUp && thumbFolded && middleFolded && ringFolded && pinkyFolded;
}

function checkPalmOpen(hand) {
	let kp = hand.keypoints;
	if (!kp || kp.length < 21) return false;
	let indexUp = kp[8].y < kp[5].y;
	let middleUp = kp[12].y < kp[9].y;
	let ringUp = kp[16].y < kp[13].y;
	let pinkyUp = kp[20].y < kp[17].y;
	return indexUp && middleUp && ringUp && pinkyUp;
}

function checkFist(hand) {
	let kp = hand.keypoints;
	if (!kp || kp.length < 21) return false;
	let center = kp[9];
	let d1 = dist(kp[8].x, kp[8].y, center.x, center.y);
	let d2 = dist(kp[12].x, kp[12].y, center.x, center.y);
	let d3 = dist(kp[16].x, kp[16].y, center.x, center.y);
	let d4 = dist(kp[20].x, kp[20].y, center.x, center.y);
	return (d1 < 75 && d2 < 75 && d3 < 75 && d4 < 75);
}

function drawAura() {
	noFill();
	stroke(drawColor);
	strokeWeight(10);
	rect(videoWidth, 0, boardWidth, boardHeight);
}

function drawEmotionBars() {
	let startX = 15;
	let startY = 255;
	fill(0, 180);
	rect(startX, startY, 290, 210, 10);
	drawBar(startX + 20, startY + 40, happyGauge, "😊 HAPPY", color(235, 190, 0));
	drawBar(startX + 20, startY + 100, sadGauge, "😢 SAD", color(0, 120, 255));
	drawBar(startX + 20, startY + 160, angryGauge, "😠 ANGRY", color(255, 0, 0));
}

function drawBar(x, y, value, label, c) {
	fill(255);
	noStroke();
	textSize(14);
	text(label, x, y - 8);
	fill(60);
	rect(x, y, 200, 18, 5); 
	fill(c);
	rect(x, y, map(value, 0, 100, 0, 200), 18, 5);
}

function drawModeText() {
	fill(0); 
	textSize(22);
	noStroke();
	if (eraserMode) {
		text("🧽 ERASER", width - 150, 40);
	} else {
		text("🎨 DRAW", width - 130, 40);
	}
}

function keyPressed() {
	if (key === "c" || key === "C") {
		drawingLayer.clear();
	}
}