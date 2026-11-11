
const express = require("express");
const app = express();
const port = 3000;
const cookieParser = require("cookie-parser");

// Set up hbs: one line, no require needed
app.set("view engine", "hbs");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve files from the "public" folder (HTML, CSS, JS)
app.use(express.static("public"));

// Parse cookies
app.use(cookieParser());

// A simple route
app.get("/", (req, res) => {
  res.render("survey", { title: "Survey" });
});

// A simple handlebars example
app.get("/home", (req, res) => {
  res.render("home", { title: "My Home Page" });
});

app.get("/animalloop", (req, res) => {
  res.render("animalloop", {
    title: "My Animals",
    animals: ["narwhal", "penguin", "seal"]
  });
});

// Processing a Form

app.get("/form", (req, res) => {
  res.render("survey", { title: "Survey" });
});

app.post("/form", (req, res) => {
  const platform = req.body.platform;
  const genre = req.body.genre;

  let votes = {
    platform: {
      playstation: 0,
      xbox: 0,
      pc: 0,
      nintendo: 0
    },
    genre: {
      action: 0,
      horror: 0,
      adventure: 0,
      racing: 0
    }
  };

  if (req.cookies.votes !== undefined) {
    if (req.cookies.votes.platform !== undefined &&
        req.cookies.votes.genre !== undefined) {
      votes = req.cookies.votes;
    }
  }

  if (votes.platform[platform] !== undefined) {
    votes.platform[platform] = votes.platform[platform] + 1;
  }

  if (votes.genre[genre] !== undefined) {
    votes.genre[genre] = votes.genre[genre] + 1;
  }

  res.cookie("votes", votes, {
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.render("response", {
    platformVotes: votes.platform,
    genreVotes: votes.genre
  });
});

app.delete("/clear", (req, res) => {
  res.clearCookie("votes");
  res.send("Votes cleared" + "<a href='/form'>Back to form</a>");
});

app.get("/api/animals", (req, res) => {
  res.json(["narwhal", "penguin", "seal"]);
});


// ----- Tracker v1 routes -----

// Opens the v1 timer
app.get("/tracker/v1", (req, res) => {
  res.sendFile("index.html", {
    root: "public/tracker/v1"
  });
});

// Opens the v1 dashboard
app.get("/tracker/v1/dashboard", (req, res) => {
  res.sendFile("dashboard.html", {
    root: "public/tracker/v1"
  });
});

// Saves a new gaming session in a cookie
app.post("/tracker/v1/save", (req, res) => {
  const game = req.body.game;
  const genre = req.body.genre;
  const date = req.body.date;
  const minutes = Number(req.body.minutes);

  if (!game || !genre || !date ||
      !Number.isFinite(minutes) || minutes <= 0) {
    return res.status(400).json({
      message: "Invalid gaming session"
    });
  }

  let sessions = req.cookies.gameTime_v1 || [];

  if (!Array.isArray(sessions)) {
    sessions = [];
  }

  sessions.push({
    date: date,
    game: game,
    genre: genre,
    minutes: minutes
  });

  sessions = sessions.slice(-30);

  res.cookie("gameTime_v1", sessions, {
    maxAge: 30 * 24 * 60 * 60 * 1000
  });

  res.json({
    message: "Session saved successfully"
  });
});

// Sends saved gaming sessions to the dashboard
app.get("/tracker/v1/data", (req, res) => {
  const sessions = req.cookies.gameTime_v1 || [];

  if (Array.isArray(sessions)) {
    res.json(sessions);
  } else {
    res.json([]);
  }
});

// Clears all saved gaming sessions
app.post("/tracker/v1/clear", (req, res) => {
  res.clearCookie("gameTime_v1");

  res.json({
    message: "All gaming sessions cleared"
  });
});


// ----- Tracker v2 routes -----

// Opens the v2 timer
app.get("/tracker/v2", (req, res) => {
  res.sendFile("index.html", {
    root: "public/tracker/v2"
  });
});

// Opens the v2 dashboard
app.get("/tracker/v2/dashboard", (req, res) => {
  res.sendFile("dashboard.html", {
    root: "public/tracker/v2"
  });
});

// Saves a new gaming session in the separate v2 cookie.
app.post("/tracker/v2/save", (req, res) => {
  const game = typeof req.body.game === "string"
    ? req.body.game.trim()
    : "";

  const genre = req.body.genre;
  const date = req.body.date;
  const minutes = Number(req.body.minutes);

  const allowedGenres = [
    "Action", "Adventure", "RPG", "Shooter", "Sports",
    "Racing", "Simulation", "Strategy", "Sandbox", "Other"
  ];

  if (!game || game.length > 60 ||
      !allowedGenres.includes(genre) ||
      typeof date !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
      !Number.isFinite(minutes) || minutes <= 0) {
    return res.status(400).json({
      message: "Invalid gaming session"
    });
  }

  let sessions = req.cookies.gameTime_v2 || [];

  if (!Array.isArray(sessions)) {
    sessions = [];
  }

  sessions.push({
    date,
    game,
    genre,
    minutes
  });

  sessions = sessions.slice(-30);

  res.cookie("gameTime_v2", sessions, {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    sameSite: "lax"
  });

  res.json({
    message: "Session saved successfully"
  });
});

// Returns saved v2 sessions as JSON.
app.get("/tracker/v2/data", (req, res) => {
  const sessions = req.cookies.gameTime_v2 || [];

  res.json(Array.isArray(sessions) ? sessions : []);
});

// Clears v2 sessions without affecting v1 or the gaming poll.
app.post("/tracker/v2/clear", (req, res) => {
  res.clearCookie("gameTime_v2");

  res.json({
    message: "All GameTime v2 sessions cleared"
  });
});


// Original dynamic route
app.get("/:name", (req, res) => {
  res.send("My name is: " + req.params.name);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
