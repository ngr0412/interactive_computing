let img;
let tile;

let tileSize = 60;
let tiles = [];
let xs = [];
let ys = [];

function preload(){
  img = loadImage('의자.png');

}

function setup() {
  createCanvas(1200, 1200);
  // imageMode(CENTER);

  for(let x=0;x<width; x+=tileSize){
    for(let x=0;x<width; x+=tileSize){
      let tile = img.get(x,y,tileSize,tileSize);
      tiles.push(tile);
      xs.push(x);
      ys.push(y);
  }
}
}

function draw() {
  background(220);
  noTint();
  image(img, 0,0);

  tile = img.get(mouseX, mouseY, 200,200);
  tint('blue');
  image(tile,mouseX,mouseY);
}
