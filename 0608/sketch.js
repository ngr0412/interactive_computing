let classifier;

function preload() {
  classifier = ml5.imageClassifier(
    "https://teachablemachine.withgoogle.com/models/JSqP_BEC7/"
  );
}

function setup() {
  createCanvas(400, 400);
  background(220);

  textSize(20);
  text("모델 로딩중...", 100, 200);
}