var express = require('express'),
	bodyParser = require('body-parser'),
	hbs = require('express-hbs'),
	fp = require('path'),
	methodOverride = require('method-override'),
	csv = require('fast-csv'),
	fs = require('fs'),
	_ = require('lodash');

var app = express();

app.use(require('connect-livereload')());

function relative(path) {
	return fp.join(__dirname, path);
}

app.engine('hbs', hbs.express4({
  partialsDir: relative('templates'),
  defaultLayout: relative('templates/default.hbs')
}));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/templates');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(methodOverride('X-HTTP-Method-Override'));

app.use(express.static(__dirname + '/public'));

// Routes here
app.get(['/', '/home'], function(req, res, next){
	res.render('home', {
		title: 'GovHack',
		layout: 'default'
	});
});

app.get(['/map'], function(req, res, next){
	res.render('map', {
		title: 'GovHack',
		layout: 'default'
	});
});

app.get('/api/gearing', function(req, res, next) {
	console.log("received request at /api/gearing: " + req.query);
	if(req.query.sa4) {
		//_.find(gearingArray, req.query.sa4);
		//res.json({"object": _.find(gearingArray, req.query.sa4)})
		//res.json(_.find(gearingArray, req.query.sa4))
		console.log("**** search by sa4" + _.find(gearingArray, req.query.sa4));
		res.json({"invalid": "request"})
	} else {

		res.json(gearingArray);
	}
})

//return data for the whole country
var stream = fs.createReadStream("./data/ato/GEARING-SA-50.csv");
var gearingArray = [];
console.log("***** starting to load gearing data:" + new Date());
csv
 .fromStream(stream, {headers: true})
 .on("data", function(data){
		gearingArray.push({sex: data["input.Sex"],
												age: data["input.AGE"],
												occupation: data["input.Occupation"],
												sa4: data["input.SA4"],
												gearing: data["GEARING"],
												gearingFlag: data["GEARINGFLAG"],
											});
 })
 .on("data-invalid", function(data) {
	 return false;
 })
 .on("end", function(){
		 console.log("***** done loading gearing data:" + new Date());
 });

var port = process.env.PORT || 3000;
app.listen(port);
console.log("App is listening on " + port);
