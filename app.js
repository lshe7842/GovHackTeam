var express = require('express'),
	bodyParser = require('body-parser'),
	hbs = require('express-hbs'),
	fp = require('path'),
	methodOverride = require('method-override'),
	csv = require('fast-csv'),
	fs = require('fs');

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

app.get(['/csv'], function(req, res, next){
	var stream = fs.createReadStream("./data/ato/GEARING-noheader.csv");
 	var dataArray = [];
	csv
	 .fromStream(stream)
	 .on("data", function(data){
	    dataArray.push(data);
	 })
	 .on("end", function(){
	     console.log("done");
	     res.json(dataArray);
	 });
});

app.get(['/map'], function(req, res, next){
	res.render('map', {
		title: 'GovHack',
		layout: 'default'
	});
});



var port = process.env.PORT || 3000;
app.listen(port);
console.log("App is listening on " + port);
