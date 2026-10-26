const express = require("express");
const app = express();
const port = 3000;

// Set up hbs: one line, no require needed
app.set("view engine", "hbs");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// Serve files from the "public" folder (HTML, CSS, JS)
app.use(express.static("public"));

// A simple route
app.get("/", (req, res) => {
  res.send("Hello World");
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
  res.render("response", {
    title: "Thanks!",
    name: req.body.name,
    animal: req.body.animal
  });
});

// A route that sends JSON
app.get("/api/animals", (req, res) => {
  res.json(["narwhal", "penguin", "seal"]);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});