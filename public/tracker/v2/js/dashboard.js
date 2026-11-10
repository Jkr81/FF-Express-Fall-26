let dailyChart = null;
let genreChart = null;

// Adds minutes together for a chosen session property.
function sumBy(sessions, key) {
  const totals = {};
  sessions.forEach(session => {
    const name = String(session[key]);
    totals[name] = (totals[name] || 0) + Number(session.minutes);
  });
  return totals;
}

// Updates the summary cards.
function updateStats(sessions) {
  const total = sessions.reduce((sum, session) => sum + Number(session.minutes), 0);
  const genres = sumBy(sessions, "genre");
  const top = Object.keys(genres).sort((a, b) => genres[b] - genres[a])[0] || "None";
  document.getElementById("totalTime").textContent = total.toFixed(1) + " min";
  document.getElementById("totalSessions").textContent = sessions.length;
  document.getElementById("topGenre").textContent = top;
  document.getElementById("arcadeCount").textContent =
    sessions.length + (sessions.length === 1 ? " machine" : " machines");
}

// Sets brighter colors for text on both charts.
function chartTextOptions() {
  return {
    color: "#dce5ff",
    font: { size: 12 }
  };
}

// Draws the bar chart with a clear empty state.
function drawDailyChart(sessions) {
  const totals = sumBy(sessions, "date");
  const dates = Object.keys(totals).sort();
  document.getElementById("dailyEmpty").hidden = dates.length > 0;
  document.getElementById("dailyChart").parentElement.hidden = dates.length === 0;
  if (dailyChart) dailyChart.destroy();
  if (dates.length === 0) return;

  dailyChart = new Chart(document.getElementById("dailyChart"), {
    type: "bar",
    data: {
      labels: dates,
      datasets: [{
        label: "Minutes Played",
        data: dates.map(date => totals[date]),
        backgroundColor: "#638cff",
        borderRadius: 7,
        maxBarThickness: 65
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: chartTextOptions() },
        tooltip: { callbacks: { label: context => context.parsed.y.toFixed(2) + " minutes" } }
      },
      scales: {
        x: {
          ticks: chartTextOptions(),
          grid: { color: "rgba(170,190,255,0.09)" },
          title: { display: true, text: "Date", color: "#dce5ff" }
        },
        y: {
          beginAtZero: true,
          ticks: chartTextOptions(),
          grid: { color: "rgba(170,190,255,0.14)" },
          title: { display: true, text: "Minutes Played", color: "#dce5ff" }
        }
      }
    }
  });
}

// Draws the doughnut chart with a readable legend.
function drawGenreChart(sessions) {
  const totals = sumBy(sessions, "genre");
  const genres = Object.keys(totals);
  document.getElementById("genreEmpty").hidden = genres.length > 0;
  document.getElementById("genreChart").parentElement.hidden = genres.length === 0;
  if (genreChart) genreChart.destroy();
  if (genres.length === 0) return;

  const palette = {
    Action: "#ff6488", Adventure: "#40d3a5", RPG: "#b28cff",
    Shooter: "#ff996b", Sports: "#5eb5ff", Racing: "#ffd16c",
    Simulation: "#7cddd8", Strategy: "#c7a5ff",
    Sandbox: "#91d873", Other: "#bec7dd"
  };

  genreChart = new Chart(document.getElementById("genreChart"), {
    type: "doughnut",
    data: {
      labels: genres,
      datasets: [{
        label: "Minutes Played",
        data: genres.map(genre => totals[genre]),
        backgroundColor: genres.map(genre => palette[genre] || palette.Other),
        borderColor: "#191f36",
        borderWidth: 3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: { ...chartTextOptions(), padding: 16 }
        },
        tooltip: {
          callbacks: {
            label: context => context.label + ": " + Number(context.raw).toFixed(2) + " min"
          }
        }
      }
    }
  });
}

// Loads the cookie-backed sessions and updates every visualization.
async function loadDashboard() {
  const message = document.getElementById("message");
  try {
    const response = await fetch("/tracker/v2/data", { cache: "no-store" });
    if (!response.ok) throw new Error("Data request failed");
    const sessions = await response.json();
    if (!Array.isArray(sessions)) throw new Error("Invalid session data");

    updateStats(sessions);
    drawDailyChart(sessions);
    drawGenreChart(sessions);

    // sketch.js is loaded before this file; the sketch also redraws on updates.
    window.updateArcade(sessions);
  } catch (error) {
    message.textContent = "Could not load your sessions. Refresh to retry.";
    message.className = "status error";
  }
}

// Clears v2 data only, then reloads the charts and arcade.
async function clearSessions() {
  if (!confirm("Clear all GameTime v2 sessions?")) return;
  const message = document.getElementById("message");
  try {
    const response = await fetch("/tracker/v2/clear", { method: "POST" });
    if (!response.ok) throw new Error("Clear failed");
    await loadDashboard();
    message.textContent = "All GameTime v2 sessions cleared.";
    message.className = "status success";
  } catch (error) {
    message.textContent = "Could not clear sessions.";
    message.className = "status error";
  }
}

// Starts the dashboard once the deferred scripts have loaded.
document.getElementById("clearBtn").addEventListener("click", clearSessions);
loadDashboard();
