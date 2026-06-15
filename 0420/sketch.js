let vine = [];
let colors=['#ff269d59','#ffd9004b','#99ff0048','#ffffff48']

function setup() {
  createCanvas(windowWidth, windowHeight);
  background('#000000');
}

function mousePressed() {
  let c = random(colors); //-> 한번 터치할때 하나의 색이 나오도록 하고 싶었음 , 클로드에게 부탁..
  for(let i=0; i<60; i++) {
    vine.push(new Vine(mouseX, mouseY,c));
  }
}


function draw() {
  
  for(let v of vine) {
    v.show();
    v.update();
}
}

class Vine {

  constructor(x,y,c) {
    this.x = x;
    this.y = y;
    this.dx = 0;
    this.dy = 0;
    this.d = 20;

    this.startX=x;
    this.startY=y;
    this.maxDist = 60;

    this.col = c ;
  }
  
  show() {
    noStroke();
    fill(this.col);
    ellipse(this.x, this.y, this.d);    
  }
  
  update() {
    
    
    this.dx += random(-1.5, 1.5);
    this.dy += random(-1, 0.5);

    this.x += this.dx;
    this.y += this.dy;

    // this.d *= random(0.997, 0.999);

    let disappear = dist(this.x, this.y, this.startX, this.startY)
    if(disappear > this.maxDist){
      this.d *= 0.97;
    } else{
      this.d *= 0.999;
    }

  }
  
  isDone() {
    if(this.x<0 || this.x>width || this.y<0 || this.y>height) {
      return true;
    } else {
      return false;
    }
  }
}