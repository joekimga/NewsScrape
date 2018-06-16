var express = require("express");
var exphbs = require("express-handlebars");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var cheerio = require("cheerio");
var request = require("request");

mongoose.Promise = Promise;

var articles = require("..models/articles.js");
var notes = require("..models/notes.js")

router.get("/", function(req, res) {
  res.render("index");
});
