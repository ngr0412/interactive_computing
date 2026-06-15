let capture;
let prevFrame;
let dots = [];
let dotSize = 20;
let cols, rows;
let ready = false;

function setup() {
  let winHeight = windowWidth * 240 / 320;
  createCanvas(windowWidth, winHeight);
  capture = createCapture(VIDEO, function() {
    capture.size(320, 240);
    capture.hide();
    capture.loadPixels();
    prevFrame = capture.get(0, 0, capture.width, capture.height);
    prevFrame.loadPixels();
    cols = ceil(width / dotSize);
    rows = ceil(height / dotSize);
    dots = [];
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        dots.push(new Dot(i * dotSize, j * dotSize));
      }
    }
    ready = true;
  });
  capture.hide();
}

function draw() {
  background(0);
  if (!ready) {
    noStroke();
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(20);
    text("카메라 로딩 중...", width / 2, height / 2);
    return;
  }

  capture.loadPixels();
  prevFrame.loadPixels();
  if (capture.pixels.length === 0 || prevFrame.pixels.length === 0) {
    return;
  }

  let movingDots = [];

  for (let i = 0; i < dots.length; i++) {
    let cdot = dots[i];
    cdot.moving = cdot.isMoving();
    if (cdot.moving) {
      cdot.d = dotSize * 2;
      movingDots.push(cdot);
    }
    cdot.show();
    cdot.update();
  }


  for (let i = 0; i < movingDots.length; i++) {
    for (let j = i + 1; j < movingDots.length; j++) {
      let a = movingDots[i];
      let b = movingDots[j];
      let d = dist(a.x, a.y, b.x, b.y);
      let maxDist = dotSize * 5;
      if (d < maxDist) {
        let alpha = map(d, 0, maxDist, 200, 0);
    
        strokeWeight(map(d, 0, maxDist, 2.5, 0.5));
        stroke(255, 220, 80, alpha);
        line(a.x, a.y, b.x, b.y);
      }
    }
  }

  noStroke();
  prevFrame = capture.get(0, 0, capture.width, capture.height);
}

class Dot {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.d = dotSize / 2;
    this.moving = false;
  }

  show() {
    noStroke();
    let r = this.d / 2;
    drawingContext.save();
    drawingContext.beginPath();
    drawingContext.arc(this.x, this.y, r, 0, Math.PI * 2);
    drawingContext.clip();
    drawingContext.translate(width, 0);
    drawingContext.scale(-1, 1);
    drawingContext.drawImage(capture.elt, 0, 0, width, height);
    drawingContext.restore();

    if (this.moving) {
      fill(255, 220, 0, 120);
    } else {
      fill(255, 130, 0, 100);
    }
    ellipse(this.x, this.y, this.d);
  }

  update() {
    if (this.d > dotSize / 2) {
      this.d--;
    }
  }

  isMoving() {
    let cx = floor(map(this.x, 0, width, 0, capture.width));
    let cy = floor(map(this.y, 0, height, 0, capture.height));
    let index = (cx + cy * capture.width) * 4;
    if (index >= capture.pixels.length || index >= prevFrame.pixels.length) {
      return false;
    }
    let r = capture.pixels[index];
    let g = capture.pixels[index + 1];
    let b = capture.pixels[index + 2];
    let pr = prevFrame.pixels[index];
    let pg = prevFrame.pixels[index + 1];
    let pb = prevFrame.pixels[index + 2];
    return dist(r, g, b, pr, pg, pb) > 80;
  }
}