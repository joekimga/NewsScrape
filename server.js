var express = require("express");
var exphbs = require("express-handlebars");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var cheerio = require("cheerio");
// var request = require("request");
var logger = require("morgan");
var axios = require("axios");


// Require all models
var db = require("./models");

// Set up our port to be either the host's designated port, or 3000
var PORT = process.env.PORT || 3000;

// Instantiate our Express App
var app = express();

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Set mongoose to leverage built in JavaScript ES6 Promises


// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, {

});



app.get("/scrape", function(req, res) {
	console.log("scrape");
	axios.get("http://www.ajc.com/").then(function(response) {
		var $ = cheerio.load(response.data);
		var testArray = [];
		$("div.medium-story-tile").each(function(i, element) {
			var result = {};

			result.title = $(this)
				.children("div.tile-headline")
				.children("a")
				.text();

			result.link = $(this)
				.children("div.tile-headline")
				.children("a")
				.attr("href");	
			testArray.push(result);	
			var newDBentry = new db.Article(result);
			newDBentry.save(function(err, doc) {
				if (err) {
					console.log(err);
				}
				else {
					console.log(doc);
				}
			})
		})
		res.json(testArray);
	});
});


app.get("/", function(req, responseToPage) {
	console.log("got database");

	db.Article.find({})
	.then(function(resultsFromQuery) {
		console.log(resultsFromQuery);
		responseToPage.json(resultsFromQuery);	
	}
	)


});



// Listen on the port
app.listen(PORT, function() {
  console.log("Listening on port: " + PORT);
});
