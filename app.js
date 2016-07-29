var express = require('express'),
	bodyParser = require('body-parser'),
	hbs = require('express-hbs'),
	fp = require('path'),
	methodOverride = require('method-override');

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



var port = process.env.PORT || 3000;
app.listen(port);
console.log("App is listening on " + port);
