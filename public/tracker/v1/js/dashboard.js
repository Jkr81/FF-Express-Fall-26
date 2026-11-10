
let dailyChart = null;
let genreChart = null;
let gamingSessions = [];

// Loads the saved gaming sessions from the Express server.
async function loadDashboard() {
  try {
    const response = await fetch("/tracker/v1/data");

    if (!response.ok) {
      throw new Error("Unable to load sessions");
    }

    gamingSessions = await response.json();

    updateStats(gamingSessions);
    createDailyChart(gamingSessions);
    createGenreChart(gamingSessions);

    if (typeof updateArcade === "function") {
      updateArcade(gamingSessions);
    }
  } catch (error) {
    document.getElementById("message").textContent =
      "Could not load gaming data.";
  }
}

// Calculates the dashboard statistics.
function updateStats(sessions) {
  const total = sessions.reduce(
    (sum, session) => sum + Number(session.minutes), 0
  );

  const genreTotals = {};

  sessions.forEach(session => {
    genreTotals[session.genre] =
      (genreTotals[session.genre] || 0) + Number(session.minutes);
  });

  const topGenre = Object.keys(genreTotals).sort(
    (a, b) => genreTotals[b] - genreTotals[a]
  )[0] || "None";

  document.getElementById("totalTime").textContent =
    total.toFixed(1) + " min";
  document.getElementById("totalSessions").textContent = sessions.length;
  document.getElementById("topGenre").textContent = topGenre;
}

// Creates the bar chart showing total minutes played each day.
function createDailyChart(sessions) {
  const dailyTotals = {};

  sessions.forEach(session => {
    dailyTotals[session.date] =
      (dailyTotals[session.date] || 0) + Number(session.minutes);
  });

  const dates = Object.keys(dailyTotals).sort();
  const minutes = dates.map(date => dailyTotals[date]);

  if (dailyChart) {
    dailyChart.destroy();
  }

  dailyChart = new Chart(document.getElementById("dailyChart"), {
    type: "bar",
    data: {
      labels: dates,
      datasets: [{
        label: "Minutes Played",
        data: minutes,
        backgroundColor: "#5488ff",
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: "Gaming Time by Day"
        }
      },
      scales: {
        x: {
          title: { display: true, text: "Date" }
        },
        y: {
          beginAtZero: true,
          title: { display: true, text: "Minutes Played" }
        }
      }
    }
  });
}

// Creates the doughnut chart showing gaming time by genre.
function createGenreChart(sessions) {
  const genreTotals = {};

  sessions.forEach(session => {
    genreTotals[session.genre] =
      (genreTotals[session.genre] || 0) + Number(session.minutes);
  });

  const colors = [
    "#5488ff", "#9b6dff", "#ff74ac", "#32d6b0",
    "#ffc857", "#ff8668", "#69c8ff", "#a3df70",
    "#d29dff", "#8e9ab7"
  ];

  if (genreChart) {
    genreChart.destroy();
  }

  genreChart = new Chart(document.getElementById("genreChart"), {
    type: "doughnut",
    data: {
      labels: Object.keys(genreTotals),
      datasets: [{
        label: "Minutes Played",
        data: Object.values(genreTotals),
        backgroundColor: colors
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: "Gaming Time by Genre"
        },
        legend: {
          position: "bottom"
        }
      }
    }
  });
}

// Clears the saved cookie through the Express clear route.
async function clearSessions() {
  if (!confirm("Clear all your gaming sessions?")) {
    return;
  }

  try {
    const response = await fetch("/tracker/v1/clear", {
      method: "POST"
    });

    if (!response.ok) {
      throw new Error("Unable to clear sessions");
    }

    document.getElementById("message").textContent =
      "All gaming sessions cleared.";

    await loadDashboard();
  } catch (error) {
    document.getElementById("message").textContent =
      "Could not clear gaming data.";
  }
}

// Connects the clear button and loads the dashboard.
document.getElementById("clearBtn").addEventListener("click", clearSessions);
loadDashboard();
