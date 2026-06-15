let t = 0;

let palette = [
  '#181818',
  '#303FFF',
  '#6643FF',
  '#DCAA97',
  '#FFA33B',
  '#F4F2F2'
];

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background('#181818');

  noStroke();

  for (let x = 0; x < width; x += 40) {
    for (let y = 0; y < height; y += 40) {

      // 메인 노이즈
      let n = noise(x * 0.01, y * 0.01, t);

      // 위아래 흔들림
      let offsetY = map(
        noise(x * 0.02, y * 0.02, t + 100),
        0,
        1,
        -25,
        25
      );

      // 더 크게 만들어 겹침 증가
      let s = 140 * n;

      // 팔레트 색상 보간
      let scaled = n * (palette.length - 1);

      let index = floor(scaled);
      let amt = scaled - index;

      let c1 = color(palette[index]);
      let c2 = color(
        palette[min(index + 1, palette.length - 1)]
      );

      let c = lerpColor(c1, c2, amt);

      // 투명도 40%
      c.setAlpha(102);

      fill(c);

      let px = x;
      let py = y + offsetY;

      // 다이아몬드
      quad(
        px, py - s / 2,
        px + s / 2, py,
        px, py + s / 2,
        px - s / 2, py
      );
    }
  }

  t += 0.01;
}