
// This sketch uses instance mode so it does not depend on global p5 functions.
(function () {
  let sessions = [];
  let sketch = null;

  const colors = {
    Action: "#ff6488", Adventure: "#40d3a5", RPG: "#b28cff",
    Shooter: "#ff996b", Sports: "#5eb5ff", Racing: "#ffd16c",
    Simulation: "#7cddd8", Strategy: "#c7a5ff",
    Sandbox: "#91d873", Other: "#bec7dd"
  };

  // Gives the arcade new data even if the fetch finishes before p5 setup.
  window.updateArcade = function (newSessions) {
    sessions = Array.isArray(newSessions) ? newSessions.slice() : [];
    if (sketch) {
      sketch.resizeArcade();
      sketch.redraw();
    }
  };

  // Creates an isolated p5 sketch inside the arcade element.
  const arcade = function (p) {
    const machineWidth = 90;
    const cellWidth = 150;
    const cellHeight = 195;
    const padding = 20;

    // Determines how many machines fit across the available width.
    function columnCount() {
      return Math.max(1, Math.floor((p.width - padding * 2) / cellWidth));
    }

    // Updates canvas height to fit the machines.
    p.resizeArcade = function () {
      const holder = document.getElementById("arcadeSketch");
      const width = Math.max(260, holder.clientWidth);
      const columns = Math.max(1, Math.floor((width - padding * 2) / cellWidth));
      const rows = Math.ceil(sessions.length / columns);
      const height = Math.max(250, rows * cellHeight + padding * 2);
      p.resizeCanvas(width, height);
    };

    // Sets up a redraw-on-demand canvas.
    p.setup = function () {
      const holder = document.getElementById("arcadeSketch");
      const canvas = p.createCanvas(Math.max(260, holder.clientWidth), 250);
      canvas.parent(holder);
      p.noLoop();
      sketch = p;
      p.resizeArcade();
      p.redraw();
    };

    // Draws one arcade cabinet with genre color and playtime label.
    function drawMachine(x, y, session) {
      const duration = Number(session.minutes) || 0;

      // Height increases with playtime, up to 5 minutes.
      const extraHeight = p.map(
        p.constrain(duration, 0, 5),
        0, 5, 0, 45
      );
      const cabinetHeight = 102 + extraHeight;

      const cabinetColor = colors[session.genre] || colors.Other;

      p.push();
      p.translate(x, y);
      p.noStroke();

      p.fill(5, 9, 24, 110);
      p.ellipse(0, cabinetHeight + 6, 108, 15);

      p.fill(cabinetColor);
      p.rect(-machineWidth / 2, 0, machineWidth, cabinetHeight, 9);
      p.fill("#10172c");
      p.rect(-36, 13, 72, 57, 5);
      p.fill(cabinetColor);
      p.rect(-30, 19, 60, 45, 4);

      p.fill("#14203c");
      p.rect(-31, 76, 62, 20, 4);
      p.fill("#e8efff");
      p.circle(-12, 86, 8);
      p.fill("#ffdc79");
      p.circle(10, 86, 7);
      p.circle(21, 86, 7);

      p.fill("#0a1022");
      p.rect(-35, cabinetHeight - 10, 70, 7, 2);

      p.textAlign(p.CENTER, p.TOP);
      p.fill("#f2f5ff");
      p.textSize(12);
      p.textStyle(p.BOLD);
      const game = String(session.game || "Unknown");
      const shortGame = game.length > 18 ? game.slice(0, 17) + "…" : game;
      p.text(shortGame, 0, cabinetHeight + 13);
      p.textStyle(p.NORMAL);
      p.fill("#c3cdec");
      p.textSize(11);
      p.text(session.genre + " • " + duration.toFixed(2) + " min", 0, cabinetHeight + 32);
      p.pop();
    }

    // Draws all machines in a centered grid or an empty-state message.
    p.draw = function () {
      p.background("#10162b");
      if (sessions.length === 0) {
        p.fill("#b6c5e8");
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(16);
        p.text("Your arcade is empty. Start a gaming session!", p.width / 2, p.height / 2);
        return;
      }

      const columns = columnCount();
      const rows = Math.ceil(sessions.length / columns);
      const usedColumns = Math.min(columns, sessions.length);
      const startX = (p.width - usedColumns * cellWidth) / 2 + cellWidth / 2;
      const startY = 23;

      sessions.forEach((session, index) => {
        const row = Math.floor(index / columns);
        const col = index % columns;
        const countThisRow = Math.min(columns, sessions.length - row * columns);
        const rowStart = (p.width - countThisRow * cellWidth) / 2 + cellWidth / 2;
        drawMachine(rowStart + col * cellWidth, startY + row * cellHeight, session);
      });
    };

    // Resizes the arcade when the window changes size.
    p.windowResized = function () {
      p.resizeArcade();
      p.redraw();
    };
  };

  // Waits until the p5 CDN has loaded; scripts in dashboard.html use defer.
  new p5(arcade, "arcadeSketch");
})();
