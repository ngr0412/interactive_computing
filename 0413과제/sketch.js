let maxw = 40;
let ellipses = [];

function setup(){
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB);

  let cols = floor(width/maxw)+1;
  let rows = floor(height/maxw) +1;

  for(let i=0; i<cols;i++){
    for(let j=0; j<rows;j++){
     ellipses.push(new Rotatingellipse(i*maxw,j*maxw)); 
    }
  }
}

function draw(){
  background(0);

  for(let ellipse of ellipses) {
    ellipse.update();
    ellipse.show();
  }
}

class Rotatingellipse{
  constructor(_x,_y){
    this.x=_x;
    this.y=_y;
    this.w= maxw;
    this.hue = 0;
    this.rad = 0;
  }

  show(){
    noStroke();
    fill(this.hue,100,100);

    push();
    translate(this.x,this.y);
    rotate(this.rad);
    ellipse(0,0,this.w, this.w * 0.6);
    pop();
  }

  update(){
    this.rad = atan2(mouseY-this.y,mouseX-this.x);

    let distance = dist(this.x,this.y,mouseX,mouseY);
    let maxdistance = dist(0,0,width,height)*0.25;
    this.w= map(distance,0,maxdistance,maxw,0);
    this.hue=map(distance,0,maxdistance,40,120);
  }
}
    

 