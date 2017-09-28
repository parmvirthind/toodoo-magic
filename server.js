"use strict";

require('dotenv').config();

const PORT          = process.env.PORT || 8080;
const ENV           = process.env.ENV || "development";
const express       = require("express");
const bodyParser    = require("body-parser");
const sass          = require("node-sass-middleware");
const app           = express();

const knexConfig    = require("./knexfile");
const knex          = require("knex")(knexConfig[ENV]);
const morgan        = require('morgan');
const knexLogger    = require('knex-logger');
const methodOverride = require('method-override');

// Seperated Routes for each Resource
const usersRoutes = require("./routes/users");
// const itemsRoutes = require("./routes/items");

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));

// Method override for HTML forms
app.use(methodOverride('_method'));

app.set("view engine", "ejs"); // Our app will be a SPA
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));

// Mount all resource routes
app.use("/users", usersRoutes(knex));
app.use("/items", itemRoutes(knex));

// Home page
app.get("/", (req, res) => {
  // redirect to login if not logged in
  // else redirect to index
  res.render("index");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.put("/login", (req, res) => {
  // on login success redirect to home
  res.redirect("index");
});

app.post("/register", (req, res) => {
  // on register success redirect to home
  res.redirect("/index");
})

app.get("/register", (req, res) => {
  res.render("register");
})

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
