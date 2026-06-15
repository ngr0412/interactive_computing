function setup() {
  createCanvas(1200, 1200);
}

function draw() {
  background(255);
  noStroke();

 
  // 검정배경


  fill(0);
  beginShape();
  vertex(600, 600);
  vertex(600, 1200);
  vertex(1200,1200);
  vertex(1200, 600);

  endShape(CLOSE);


  // 왼쪽왕눈알
  fill('#D9D9D9');
  ellipse(714+911/2,659+791/2,911,791);

  fill('#D9D9D9');
  beginShape();
  vertex(480, 1055);
  vertex(892, 741);
  vertex(892,1368);

  endShape(CLOSE);


  //왼쪽왕눈알

  fill('#FF000022');
  ellipse(846+221/2,856+221/2,221);

  fill('#FF000022');
  ellipse(847+388/2,790+388/2,388);

  fill('#FF000022');
  ellipse(836+521/2,749+521/2,521);

  fill('#FF000022');
  ellipse(816+704/2,703+704/2,704);



// 오른쪽 왕눈알
  fill('#D9D9D9');
  ellipse(3+832/2,208+722/2,832,722);

  fill('#D9D9D9');
  beginShape();
  vertex(548, 241);
  vertex(1050, 572);
  vertex(673,853);

  endShape(CLOSE);


  //오른쪽 왕눈알

  fill('#FF000022');
  ellipse(96+643/2,251+643/2,643);


 
  // 중간 눈알
  fill('#006570');
  ellipse(900,600+311,358,311);

  fill('#006570');
  beginShape();
  vertex(600+28, 912);
  vertex(790, 788);
  vertex(790,1033);

  endShape(CLOSE);

  fill('#006570');
  beginShape();
  vertex(1010, 788);
  vertex(1172, 912);
  vertex(1010,1033);

  endShape(CLOSE);


  //중간 눈동자

  fill('#FFFFFF');
  ellipse(900,785+277/2,277);

  fill('#FF000055');
  ellipse(900,785+277/2,277);

  fill('#FF000055');
  ellipse(900,855+205/2,205);

  fill('#FF000055');
  ellipse(900,900+152/2,152);

  fill('#FF000055');
  ellipse(900,960+89/2,89);


   // 기쁨배경
  

  fill('#E8FF1C');
  beginShape();
  vertex(0, 0);
  vertex(600, 0);
  vertex(600,600);
  vertex(0, 600);
  endShape(CLOSE);

  fill('#E40067');
  beginShape();
  vertex(0,0);
  vertex(180, 0);
  vertex(491, 470);
  vertex(100, 80);
  vertex(361,560);
  vertex(0, 463);
  vertex(0, 0);
  endShape(CLOSE);

  fill('#00C47C');
  beginShape();
  vertex(510,0);
  vertex(292, 171);
  vertex(599, 274);
  vertex(385, 310);
  vertex(599,330);
  vertex(431, 380);
  vertex(599, 529);
  vertex(350, 540);
  vertex(599, 573);
  vertex(0, 594);
  vertex(0, 600);
  vertex(600, 600);
  vertex(600, 0);
  endShape(CLOSE);


	// 슬픔배경
  fill('#060101');
  beginShape();
  vertex(600, 0);
  vertex(1200, 0);
  vertex(1200,600);
  vertex(600, 600);

  endShape(CLOSE);

  let gradient1=drawingContext.createLinearGradient(674,345,674,215);
  gradient1.addColorStop(0,'#000A42');
  gradient1.addColorStop(1,'#0019A833');


  drawingContext.fillStyle=gradient1
  ellipse(608+128/2,264+10+131/2,131);

 drawingContext.fillStyle=gradient1
  ellipse(608+128/2,224+10+131/2,131);


 drawingContext.fillStyle=gradient1
  ellipse(608+128/2,184+10+131/2,131);


  drawingContext.fillStyle=gradient1
  ellipse(608+128/2,144+10+131/2,131);

  let gradient2=drawingContext.createLinearGradient(674,345,674,215);
  gradient2.addColorStop(0,'#000A42');
  gradient2.addColorStop(1,'#0019A833');


  drawingContext.fillStyle=gradient2
  ellipse(742+207/2,374+207/2,207);

  drawingContext.fillStyle=gradient2
  ellipse(742+207/2,297+207/2,207);

  drawingContext.fillStyle=gradient2
  ellipse(742+207/2,137+207/2,207);

  drawingContext.fillStyle=gradient2
  ellipse(742+207/2,-11+207/2,207);



  let gradient3=drawingContext.createLinearGradient(674,345,674,215);
  gradient3.addColorStop(0,'#000A42');
  gradient3.addColorStop(1,'#0019A833');


  drawingContext.fillStyle=gradient3
  ellipse(950+100/2,230+100/2,100);

  drawingContext.fillStyle=gradient3
  ellipse(950+100/2,220+100/2,100);

   drawingContext.fillStyle=gradient3
  ellipse(950+100/2,210+100/2,100);

   drawingContext.fillStyle=gradient3
  ellipse(950+100/2,180+100/2,100);

  drawingContext.fillStyle=gradient3
  ellipse(950+100/2,160+100/2,100);

  drawingContext.fillStyle=gradient3
  ellipse(950+100/2,120+100/2,100);

  drawingContext.fillStyle=gradient3
  ellipse(950+100/2,80+100/2,100);

  drawingContext.fillStyle=gradient3
  ellipse(950+100/2,40+100/2,100);

  drawingContext.fillStyle=gradient3
  ellipse(950+100/2,10+100/2,100);



  let gradient4=drawingContext.createLinearGradient(674,345,674,215);
  gradient4.addColorStop(0,'#000A42');
  gradient4.addColorStop(1,'#0019A833');


  drawingContext.fillStyle=gradient4
  ellipse(1052+141/2,432+141/2,141);

  drawingContext.fillStyle=gradient4
  ellipse(1052+141/2,422+141/2,141);

  drawingContext.fillStyle=gradient4
  ellipse(1052+141/2,390+141/2,141);

  drawingContext.fillStyle=gradient4
  ellipse(1052+141/2,360+141/2,141);

   drawingContext.fillStyle=gradient4
  ellipse(1052+141/2,330+141/2,141);



  drawingContext.fillStyle=gradient4
  ellipse(1052+141/2,-81+141/2,141);

  drawingContext.fillStyle=gradient4
  ellipse(1052+141/2,179+141/2,141);
  




	// 노여움배경
  fill('#FF0004');
  beginShape();
  vertex(0, 600);
  vertex(600, 600);
  vertex(600,1200);
  vertex(0, 1200);

  endShape(CLOSE);

  //fill('#380051');
  //beginShape();
  //vertex(0, 600);
  //vertex(0, 691);
  //vertex(600,691);
  //vertex(600, 600);

  //endShape(CLOSE);

  //fill('#380051');
  //beginShape();
  //vertex(0, 1034);
  //vertex(0, 1200);
  //vertex(600,1200);
  //vertex(600,1034);
  //endShape(CLOSE);


 let gradientfear=drawingContext.createLinearGradient(750,0,750,500);
  gradientfear.addColorStop(0,'#A80812');
  gradientfear.addColorStop(1,'#420307');
 

  drawingContext.fillStyle=gradientfear
  rect(500,0,500,500);



  //1
  fill('#380051');
  beginShape();
  vertex(48,826);
  vertex(34, 931);
  vertex(48, 941);
  endShape(CLOSE);

  //2
  fill('#380051');
  beginShape();
  vertex(100,785);
  vertex(76, 977);
  vertex(91, 1009);
  vertex(106, 1016);
  endShape(CLOSE);

  //3
  fill('#380051');
  beginShape();
  vertex(130,821);
  vertex(129, 975);
  vertex(138, 943);
  endShape(CLOSE);
  
 //4
  fill('#380051');
  beginShape();
  vertex(186,816);
  vertex(186, 923);
  vertex(231, 949);
  vertex(519, 743);
  vertex(558,810);
  vertex(583, 751);
  vertex(538, 719);
  vertex(202, 916);
  vertex(193, 910);
  endShape(CLOSE);

   //5
  fill('#1A0026');
  beginShape();
  vertex(240,710);
  vertex(197, 769);
  vertex(153, 814);
  endShape(CLOSE);



}
