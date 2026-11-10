
let arcadeSessions = [];

const arcadeColors = {
  Action: "#ff6688",
  Adventure: "#54d6aa",
  RPG: "#a77bff",
  Shooter: "#ff995e",
  Sports: "#5bafff",
  Racing: "#ffd166",
  Simulation: "#7edbda",
  Strategy: "#c4a2ff",
  Sandbox: "#81cc7b",
  Other: "#ccccdd"
};

// Receives the current gaming sessions from the dashboard.
function updateArcade(sessions) {
  arcadeSessions = sessions;
}

// Creates the p5 canvas inside the dashboard.
function setup() {
  const container = document.getElementById("arcadeSketch");
  const canvas = createCanvas(container.clientWidth, 300);
  canvas.parent("arcadeSketch");
  noStroke();
}

// Draws the arcade and its gaming session machines.
function draw() {
  background(15, 19, 40);

  fill(28, 35, 64);
  rect(0, height - 40, width, 40);

  if (arcadeSessions.length === 0) {
    fill(180, 190, 220);
    textAlign(CENTER, CENTER);
    textSize(16);
    text("Your arcade is empty. Play a game!", width / 2, height / 2);
    return;
  }

  const columns = Math.max(1, Math.floor(width / 75));
  const rows = Math.ceil(arcadeSessions.length / columns);
  const spacingY = 105;
  const requiredHeight = Math.max(300, rows * spacingY + 35);

  if (height !== requiredHeight) {
    resizeCanvas(width, requiredHeight);
  }

  arcadeSessions.forEach((session, index) => {
    const col = index % columns;
    const row = Math.floor(index / columns);
    const x = col * (width / columns) + (width / columns) / 2;
    const y = row * spacingY + 30;

    drawMachine(x, y, session);
  });
}

// Draws one arcade machine based on the session genre and duration.
function drawMachine(x, y, session) {
  const duration = Number(session.minutes);
  const machineHeight = map(
    constrain(duration, 0, 240), 0, 240, 55, 85
  );

  const color = arcadeColors[session.genre] || arcadeColors.Other;

  push();
  translate(x, y);

  fill(color);
  rect(-22, 0, 44, machineHeight, 5);

  fill(10, 15, 35);
  rect(-16, 9, 32, 27, 3);

  fill(color);
  rect(-12, 13, 24, 19, 2);

  fill(240);
  rect(-3, 43, 6, 6, 2);

  fill(10, 15, 35);
  rect(-17, machineHeight - 10, 34, 5);

  fill(230);
  textAlign(CENTER);
  textSize(9);
  text(session.genre, 0, machineHeight + 13);

  pop();
}

// Resizes the arcade when the browser window changes.
function windowResized() {
  const container = document.getElementById("arcadeSketch");
  resizeCanvas(container.clientWidth, height);
}
