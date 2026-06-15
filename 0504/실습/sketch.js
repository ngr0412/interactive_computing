let capture;
let prevFrame;
let dots = [];
let dotSize = 20;
let cols, rows;
let ready = false;
let dotGrid = {};

function setup() {
  let winHeight = windowWidth * 240 / 320;
  createCanvas(windowWidth, winHeight);
  noStroke();
  capture = createCapture(VIDEO, () => {
    capture.size(320, 240);
    capture.hide();
    capture.loadPixels();
    prevFrame = capture.get(0, 0, capture.width, capture.height);
    prevFrame.loadPixels();
    cols = ceil(width / dotSize);
    rows = ceil(height / dotSize);
    dots = [];
    dotGrid = {};
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        let d = new Dot(i * dotSize, j * dotSize, i, j);
        dots.push(d);
        dotGrid[`${i},${j}`] = d;
      }
    }
    ready = true;
  });
  capture.hide();
}

function draw() {
  background(0);
  if (!ready) {
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(20);
    text("카메라 로딩 중...", width / 2, height / 2);
    return;
  }

  capture.loadPixels();
  prevFrame.loadPixels();
  if (capture.pixels.length === 0 || prevFrame.pixels.length === 0) return;

  for (let cdot of dots) {
    // 마우스 반발