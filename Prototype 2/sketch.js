let video;
let poseNet;
let poses = [];

let item;
let x = 0; let y = 0;
let xoff = 0; let yoff = 0;
let move = 2;
let loc1 = 0;
let winW = 1080/1.52; let winH = 1920/1.52;
let oldPrevW = winW/3; let oldPrevH = winH/3;
let prevW = winW/3; let prevH = winH/3;
let noseX = 0; let noseY = 0;

function preload(){
  item = loadImage('http://localhost:8080/item.jpg');
  qr = loadImage('http://localhost:8080/qr.png');
}

function modelReady() {
  select('#status').html('Model Loaded');
}


function setup() {
  createCanvas(winW, winH);
  video = createCapture(VIDEO);
  video.size(640, 480);

  poseNet = ml5.poseNet(video, modelReady);
  poseNet.on('pose', function(results) {
    poses = results;
  });
  video.hide();
}

function draw() {

  let cx = constrain(x,0,item.width-oldPrevW);
  let cy = constrain(y,0,item.height-oldPrevH);

  image(item, 0, 0, winW, winH, cx, cy, prevW, prevH);
  // image(video, 0, 0, 640/4, 480/4);

  push();
  fill(255,255,255,180);
  noStroke();
  rect(0,winH-100,winW,70);
  pop();

  textSize(43);
  fill(139,69,19,200);
  let plug1 = "Scan de QR code of vind het volledige artikel op www.delpher.nl 'Grietje kan koken! door Adolf Holst'!";

  text(plug1, loc1, winH-55);
  image(qr, 40, winH-100);
  qr.resize(70,70);

  loc1 = loc1 - move;
  if (loc1 <= -textWidth(plug1)) {
    loc1 = winW;
    }

  if (poses.length > 0){
    interaction();
  }
  else {
    agency();
  }
}

function interaction(){
  x = map(noseX, 0, video.width, item.width-oldPrevW, 0);
  y = map(noseY, 0, video.height, 0, item.height-oldPrevH);

  xoff = x;
  yoff = y;

  for (let i = 0; i < min(poses.length, 1); i++) {
    let pose = poses[i].pose;
    for (let j = 0; j < poses[i].pose.keypoints.length; j++) {
      let keypoint = pose.keypoints[j];

      if (keypoint.score > 0.2) {
        if (j == 0){
          let newnoseX = keypoint.position.x;
          let newnoseY = keypoint.position.y;
          noseX = lerp(noseX, newnoseX, 0.06);
          noseY = lerp(noseY, newnoseY, 0.06);

          // fill(46, 255, 175);
          // noStroke();
          // ellipse(noseX/4, noseY/4, 5, 5);
        }
      }
    }
  }
}

function agency(){
  x = map(noise(xoff), 0, 1, 0, (item.width));
  y = map(noise(yoff), 0, 1, 0, (item.height));
  xoff += 0.017;
  yoff += 0.017;
}
