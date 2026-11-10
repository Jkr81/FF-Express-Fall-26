let startTime = null;
let timerInterval = null;
let saving = false;

const gameInput = document.getElementById("game");
const genreInput = document.getElementById("genre");
const timerDisplay = document.getElementById("timer");
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const message = document.getElementById("message");

// Formats seconds as 00:00:00.
function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remaining = seconds % 60;
  return [hours, minutes, remaining]
    .map(value => String(value).padStart(2, "0")).join(":");
}

// Uses the actual start time so the timer does not drift.
function updateTimer() {
  if (startTime === null) return;
  timerDisplay.textContent = formatTime(Math.floor((Date.now() - startTime) / 1000));
}

// Starts a session after checking the form.
function startSession() {
  if (!gameInput.value.trim() || !genreInput.value) {
    message.textContent = "Enter a game name and select a genre first.";
    message.className = "status error";
    return;
  }

  startTime = Date.now();
  updateTimer();
  timerInterval = setInterval(updateTimer, 250);
  startBtn.disabled = true;
  stopBtn.disabled = false;
  gameInput.disabled = true;
  genreInput.disabled = true;
  message.textContent = "Session in progress...";
  message.className = "status";
}

// Sends the finished session to Express and handles failures.
async function stopSession() {
  if (startTime === null || saving) return;
  saving = true;
  clearInterval(timerInterval);

  const minutes = Math.max(0.01, Math.round(((Date.now() - startTime) / 60000) * 100) / 100);
  const now = new Date();
  const date = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0")
  ].join("-");

  stopBtn.disabled = true;
  message.textContent = "Saving your session...";
  message.className = "status";

  try {
    const response = await fetch("/tracker/v2/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: date,
        game: gameInput.value.trim(),
        genre: genreInput.value,
        minutes: minutes
      })
    });
    if (!response.ok) throw new Error("Save failed");

    message.textContent = "✓ Session saved! Open Dashboard to see your stats.";
    message.className = "status success";
    startTime = null;
    startBtn.disabled = false;
    gameInput.disabled = false;
    genreInput.disabled = false;
  } catch (error) {
    message.textContent = "Could not save. Press Stop & Save to try again.";
    message.className = "status error";
    stopBtn.disabled = false;
  } finally {
    saving = false;
  }
}

// Wires up the timer buttons.
startBtn.addEventListener("click", startSession);
stopBtn.addEventListener("click", stopSession);
