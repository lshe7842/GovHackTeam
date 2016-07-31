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

		res.json(saSummary);
	}
})

//return data for the whole country
var stream = fs.createReadStream("./data/ato/GEARING-SA.csv");
var gearingArray = [];
var saSummary = null;
Log("***** Start loading gearing data");
csv
 .fromStream(stream, {headers: true})
 .on("data", function(data){
	  if(!data["input.SA4"]) return;
		gearingArray.push({sex: data["input.Sex"],
												age: data["input.AGE"],
												occupation: data["input.Occupation"],
												sa4: data["input.SA4"],
												gearing: data["GEARING"],
												gearingFlag: data["GEARINGFLAG"],
											});
 })
 .on("end", function(){
		 Log("***** Done loading gearing data");

		 var result = _.reduce(gearingArray, function(aggregate, row) {
			//  console.log(row);
			 if(!row.sa4) return aggregate;
			 if(!aggregate[row.sa4]) {
				 aggregate[row.sa4] = {sa4: row.sa4, positivelyGeared: 0, negativelyGeared: 0, neutralGeared: 0};
			 }
			 if(row.gearing > 0) aggregate[row.sa4].positivelyGeared++;
			 else if(row.gearing < 0) aggregate[row.sa4].negativelyGeared++;
			 else aggregate[row.sa4].neutralGeared++;
		  return aggregate;
		}, {});


		result = _.toArray(result);
		saSummary = _.each(result, function(row) {
			var count = row.positivelyGeared + row.negativelyGeared;
			row.positivelyGeared = Math.round(row.positivelyGeared * 100 / count);
			row.negativelyGeared = Math.round(row.negativelyGeared * 100 / count);
			row.neutralGeared = Math.round(row.neutralGeared * 100 / count);
		})

 });


function Log(text) {
	console.log(new Date() + ": " + text);
}


var port = process.env.PORT || 3000;
app.listen(port);
console.log("App is listening on " + port);
