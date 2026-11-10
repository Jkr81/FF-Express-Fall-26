
let startTime = null;
let timerInterval = null;

// Converts elapsed seconds into hours, minutes, and seconds.
function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remaining = seconds % 60;

  return [hours, minutes, remaining]
    .map(number => String(number).padStart(2, "0"))
    .join(":");
}

// Updates the timer display.
function updateTimer() {
  const seconds = Math.floor((Date.now() - startTime) / 1000);
  document.getElementById("timer").textContent = formatTime(seconds);
}

// Starts a new gaming session.
function startSession() {
  const game = document.getElementById("game").value.trim();
  const genre = document.getElementById("genre").value;
  const message = document.getElementById("message");

  if (!game || !genre) {
    message.textContent = "Enter a game name and select a genre.";
    return;
  }

  startTime = Date.now();
  timerInterval = setInterval(updateTimer, 1000);

  document.getElementById("timer").textContent = "00:00:00";
  document.getElementById("startBtn").disabled = true;
  document.getElementById("stopBtn").disabled = false;
  document.getElementById("game").disabled = true;
  document.getElementById("genre").disabled = true;
  message.textContent = "Session in progress...";
}

// Stops the timer and saves the session using Express.
async function stopSession() {
  clearInterval(timerInterval);

  const elapsed = (Date.now() - startTime) / 60000;
  const minutes = Math.round(elapsed * 100) / 100;

  const session = {
    date: new Date().toLocaleDateString("en-CA"),
    game: document.getElementById("game").value.trim(),
    genre: document.getElementById("genre").value,
    minutes: Math.max(0.01, minutes)
  };

  const message = document.getElementById("message");
  document.getElementById("stopBtn").disabled = true;

  try {
    const response = await fetch("/tracker/v1/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(session)
    });

    if (!response.ok) {
      throw new Error("Unable to save session");
    }

    message.textContent = "Gaming session saved!";
    startTime = null;
    document.getElementById("startBtn").disabled = false;
    document.getElementById("game").disabled = false;
    document.getElementById("genre").disabled = false;
  } catch (error) {
    message.textContent = "Could not save session. Try again.";
    document.getElementById("stopBtn").disabled = false;
  }
}

// Connects the timer buttons to their functions.
document.getElementById("startBtn").addEventListener("click", startSession);
document.getElementById("stopBtn").addEventListener("click", stopSession);
