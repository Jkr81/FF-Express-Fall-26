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

// app.post("/form", (req, res) => {
//   res.render("response", {
//     title: "Thanks!",
//     name: req.body.name,
//     animal: req.body.animal
//   });
// });

app.post("/form", (req, res) => {
  const name = req.body.name;
  const animal = req.body.animal;

  // 1. Start every animal at 0 votes
  let votes = {
    narwhal: 0,
    penguin: 0,
    seal: 0
  };

  // 2. If the browser already has a votes cookie, use those counts instead
  if (req.cookies.votes !== undefined) {
    votes = req.cookies.votes;
  }

  // 3. If this animal isn't in the list yet, start it at 0
  if (votes[animal] === undefined) {
    votes[animal] = 0;
  }

  // 4. Add 1 vote to the animal they picked
  votes[animal] = votes[animal] + 1;

  // 5. Save the updated counts back to the cookie
  res.cookie("votes", votes, { maxAge: 7 * 24 * 60 * 60 * 1000 });

  res.render("response", {
      votes: votes
  });
});

app.delete("/clear", (req, res) => {
  res.clearCookie("votes");
  res.send("Votes cleared" + "<a href='/form'>Back to form</a>");
});

app.get("/:name", (req, res)=>{
    res.send("My name is: " + req.params.name);
});

// A route that sends JSON
app.get("/api/animals", (req, res) => {
  res.json(["narwhal", "penguin", "seal"]);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});