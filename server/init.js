/**
*
*
*/
var express = require('express');
var browserify = require('browserify-middleware');
var less = require('less-middleware');
var nunjucks = require('nunjucks');
var config = require('../client/config');
var app = express(); // initialise express

// use nunjucks to process view templates in express
nunjucks.configure('server/templates/views', {
    express: app
});

// less will automatically compile matching requests for .css files
app.use(less('public'));
// public assets are served before any dynamic requests
app.use(express.static('public'));

// common packages are precompiled on server start and cached
app.get('/js/' + config.common.bundle, browserify(config.common.packages, {
	cache: true,
	precompile: true
}));

// any file in /client/scripts will automatically be browserified,
// excluding common packages.
app.use('/js', browserify('./client/scripts', {
	external: config.common.packages,
	transform: ['babelify']
}));


var speech = require('./speech');
var weather = require('./weather');
var news = require('./news');
var calendar = require('./calendar');

app.get('/startListen', speech.startListen);
app.get('/stopListen', speech.stopListen);
app.get('/getWeather', weather.getWeather);
app.get('/getNews', news.getNews);
app.get('/getSchedule', calendar.getSchedule);

/*
	set up any additional server routes (api endpoints, static pages, etc.)
	here before the catch-all route for index.html below.
*/
app.get('*', function(req, res) {
	// this route will respond to all requests with the contents of your index
	// template. Doing this allows react-router to render the view in the app.
	res.render('index.html');
});



// start the server
var server = app.listen(process.env.PORT || 3000, function() {
	console.log('\nServer ready on port %d\n', server.address().port);
});


// //create a cron job to keep the server running
// var CronJob = require("cron").CronJob;
// var refresh = new CronJob({
// 	cronTime : "0 */2 * * * *",
// 	onTick : keepAlive,
// 	start : true
// });

/** ping the server to keep it from idling */
/*
function keepAlive() {
	request.get({
		url : "https://mbbc-webservice.herokuapp.com/"
		//url : "http://localhost:3000"
	}, function() {
		console.log('server alives!');

	});
}
*/
