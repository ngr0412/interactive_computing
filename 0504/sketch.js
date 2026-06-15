let video;
let prevFrame;

function setup() {
  createCanvas(640, 480);

  video = createCapture(VIDEO);
  video.size(640,480);
  video.hide();

  prevFrame = video.get(0,0,video.width, video.height);

}

function draw() {
  background(0);

  video.loadPixels();
  prevFrame.loadPixels();

  for(let x = 0; x<video.width; x++){
    for(let y=0;y<video.height;y++){
      let index = (x + y*video.width) * 4;
      let r = video.pixels[index];
      let g = video.pixels[index+1];
      let b = video.pixels[index+2];
      let pr = preFrame.pixels[index];
      let pg = preFrame.pixels[index+1];
      let pb = preFrame.pixels[index+2];
  
      let distance = dist(r,g,b,pr,pg,pb);
      if(distance>80){
        fill(255,0,0);
        noStroke();
        ellipse(x,y,1);
      }
    }
  }

   prevFrame = video.get(0,0,video.width, video.height);
  
}
