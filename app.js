
const express = require("express");
const app = express();
const port = 3000;
const cookieParser = require("cookie-parser");

// Set up hbs: one line, no require needed
app.set("view engine", "hbs");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

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
  res.render("home", {title: "My Home Page"});
});

app.get("/animalloop", (req, res) => {
  res.render("animalloop", {
    title: "My Animals",
    animals: ["narwhal", "penguin", "seal"]
  });
});

//Processing a Form

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


  res.cookie("votes", votes, { maxAge: 7 * 24 * 60 * 60 * 1000 });

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

app.get("/:name", (req, res)=>{
    res.send("My name is: " + req.params.name);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
