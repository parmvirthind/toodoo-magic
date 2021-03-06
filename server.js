"use strict";

require('dotenv').config();

const PORT            = process.env.PORT || 8080;
const ENV             = process.env.ENV || "development";
const express         = require("express");
const bodyParser      = require("body-parser");
const sass            = require("node-sass-middleware");
const app             = express();

const knexConfig      = require("./knexfile");
const knex            = require("knex")(knexConfig[ENV]);
const morgan          = require('morgan');
const knexLogger      = require('knex-logger');
const methodOverride  = require('method-override');
const cookieSession   = require('cookie-session');
const bcrypt          = require('bcrypt');


// Seperated Routes for each Resource
const userRoutes   = require("./routes/user");
const itemsRoutes   = require("./routes/items");
const generalRoutes = require("./routes/general");

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));

// Method override for HTML forms
app.use(methodOverride('_method'));

// Setup cookie session
app.use(cookieSession({
  name: 'toodoo',
  secret: 'lighthouse'
}));

// Setup cookies as response locals
app.use(function(req, res, next) {
  res.locals = {
    user_id: req.session.user_id
  }
  next();
});

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
app.use("/user", userRoutes(knex));
app.use("/items", itemsRoutes(knex));
app.use("/", generalRoutes(knex));

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
