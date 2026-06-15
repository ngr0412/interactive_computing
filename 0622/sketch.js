let particles = [], ground = [];
let bg = 20;
const txt = "말은사람의입에서태어났다가사람의귀에서죽는다.하지만어떤말들은죽지않고사람의마음속으로들어가살아남는다.사람을좋아하는일이꼭울음으로여겨질때가많았다.일부러시작할수도없고그치려해도잘그쳐지지않는.흐르고흘러가다툭툭떨어지기도하며.일상의공간은어디로든떠날수있는출발점이되어주고여행의시간은그간우리가지나온익숙함들을가장눈부신것으로되돌려놓는다.떠나야돌아올수있다.";


function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont('serif'); textAlign(CENTER, CENTER); noStroke();
  resetParticles(); 
}

function draw() {
  background(bg);
  
  let movingCount = 0;

  for (let p of particles) {
    p.up(); p.show();
    let x = floor(p.x);
    
    if (p.fall == 1) {
      movingCount++; 
      if (x >= 0 && x < width && p.y > ground[x]) {
        p.y = ground[x]; p.fall = 0; 
        for (let a = x - 15; a < x + 15; a++)
          if (a >= 0 && a < width) ground[a] -= map(abs(a - x), 0, 15, 12, 0);
      }
    }
  }

  let waitingCount = 0;
  for (let p of particles) {
    if (p.fall == 0 && p.y < height / 2) waitingCount++;
  }

  if (movingCount == 0 && waitingCount == 0) {
    resetParticles();
  }
}

function resetParticles() {
  particles = [];
  ground = [];
  for (let i = 0; i < width; i++) ground[i] = height - 30;

  bg = color(random(20, 80), random(20, 80), random(20, 80));

  let idx = 0, gap = 30;
  for (let y = 100; y < height / 2; y += gap) {
    for (let x = 100; x < width - 100; x += gap) {
      particles.push(new Char(x, y, txt[idx++ % txt.length]));
    }
  }
}

function mousePressed() { drop(); }
function mouseDragged() { drop(); }

function drop() {
  for (let p of particles) {
    if (p.fall == 0 && dist(mouseX, mouseY, p.x, p.y) < 40) {
      p.fall = 1;
    }
  }
}

class Char {
  constructor(x, y, c) {
    this.x = x; this.y = y; this.ch = c;
    this.vx = random(-0.5, 0.5); this.vy = this.ang = 0;
    this.rot = random(-3, 3); this.fall = 0;
  }
  show() {
    push(); translate(this.x, this.y); rotate(radians(this.ang));
    fill(255, 220); textSize(20); text(this.ch, 0, 0); pop();
  }
  up() {
    if (this.fall == 1) {
      this.vy += 0.4; this.x += this.vx; this.y += this.vy; this.ang += this.rot;
    }
  }
}