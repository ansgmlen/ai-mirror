//var React = require('react/addons');
import React from 'react';
import ReactDOM from 'react-dom';
var CONFIG = JSON.parse(localStorage.getItem('CONFIG'));
var moment = require("moment");
var homeService = require("../home/homeService");
var Defaults = require('../../mixins/Defaults');
var Clock =  require('../../../client/components/clock');

module.exports = React.createClass({
	displayName: 'VIEW_Home',
	getInitialState: function() {
		return {
			viewName :"Home",
			temperature : '',
			day : '',
			date : '',
			weatherDesc : '',
			weatherIcon : '',
			iconPath : '',
			weatherCurrentSummary : '',
			weatherDailySummary : '',
			dailyWeather : []
		};
	},
	componentDidMount: function() {
		console.log("home loaded");
		this.getWeather();
	},
	openView: function(_viewName) {
		window.open(CONFIG.currentEnv.endpoint + _viewName, '_self', false); //open home
	},
	lookupIcon:function(_icon){
		var iconPath = "";
		var icons = [{type:'clear-day',path :"images/weather/Sun.png"},//# clear sky day
		{type:'wind',path :"images/weather/Wind.png"},//#wind
		{type:'cloudy',path :"images/weather/Cloud.png"},//#cloudy day
		{type:'partly-cloudy-day',path :"images/weather/PartlySunny.png"},//# partly cloudy day
		{type:'rain',path :"images/weather/Rain.png"},//#wind
		{type:'snow',path :"images/weather/Snow.png"},//#wind
		{type:'snow-thin',path :"images/weather/Snow.png"},//#wind
		{type:'fog',path :"images/weather/Haze.png"},//#Haze
		{type:'clear-night',path :"images/weather/Moon.png"},//#wind
		{type:'partly-cloudy-night',path :"images/weather/PartlyMoon.png"},//#wind
		{type:'thunderstorm',path :"images/weather/Storm.png"},//#wind
		{type:'tornado',path :"images/weather/Tornado.png"},//#wind
		{type:'hail',path :"images/weather/Hail.png"},//#wind
	  ];

		for(var i in icons){
			if(icons[i].type == _icon){
				iconPath = icons[i].path;
			}
		}

		return iconPath;

	},
	getWeather : function(){

		var self = this;
		var now = new Date();

		homeService.getWeather().then((res)=>{

			self.state.weatherIcon = self.lookupIcon(res.currently.icon);

			//TODO here is todo for displaying data
			self.setState({
		    temperature: res.currently.temperature,
				weatherIcon : res.currently.icon,
				weatherCurrentSummary: res.currently.summary,
				weatherDailySummary : res.daily.summary,
				dailyWeather : res.currently.daily,
				day : moment(now).format('dddd'),
				date : moment(now).format('ll'),
	    });

		}, (err)=>{
			console.log(err);
		});
	},

	render () {

		return (
			<div className="page-container">
				<div style={{overflow:'hidden'}}>
					<div style={{float:'left'}}>
						<div style={{color: Defaults.ui.color.white, fontSize:Defaults.ui.fontSize.temperature}}>{this.state.temperature}°</div>
						<img style={{color: Defaults.ui.color.white, fontSize:Defaults.ui.fontSize.temperature}} src={this.state.iconPath}></img>
					</div>
					<div style={{float:'right'}}>
						<Clock name="Clock" UTCOffset="-5"/>
					</div>
				</div>

				<div style={{overflow:'hidden'}}>
					<div style={{float:'left'}}>
						<div style={{color: Defaults.ui.color.white, fontSize:Defaults.ui.fontSize.large}}>{this.state.weatherCurrentSummary}</div>
						<div style={{color: Defaults.ui.color.white, fontSize:Defaults.ui.fontSize.large}}>{this.state.weatherDailySummary} </div>
					</div>
					<div style={{float:'right'}}>
						<div style={{color: Defaults.ui.color.white, fontSize:Defaults.ui.fontSize.large}}>{this.state.day}</div>
						<div style={{color: Defaults.ui.color.white, fontSize:Defaults.ui.fontSize.large}}>{this.state.date}</div>
					</div>
				</div>

				<div style={{overflow:'hidden', marginTop:'80%', color: Defaults.ui.color.white, fontSize:Defaults.ui.fontSize.xLarge}}>Headlines
					<div style={{float:'left'}}>
						<div style={{color: Defaults.ui.color.white, fontSize:Defaults.ui.fontSize.large}}>
							news1 will be here
						</div>
						<div style={{color: Defaults.ui.color.white, fontSize:Defaults.ui.fontSize.large}}>
							news2 will be here
						</div>
						<div style={{color: Defaults.ui.color.white, fontSize:Defaults.ui.fontSize.large}}>
							news3 will be here
						</div>
					</div>

					<div style={{float:'right'}}>
						<div style={{color: Defaults.ui.color.white, fontSize:Defaults.ui.fontSize.large}}>Today schedule</div>
						<div style={{color: Defaults.ui.color.white, fontSize:Defaults.ui.fontSize.large}}>Baby shower for friend</div>
					</div>

				</div>

				<div style={{marginTop:'15px', display: 'flex', justifyContent: 'center'}}>
					<div className="" style={{color: Defaults.ui.color.white, fontSize:Defaults.ui.fontSize.large}} onClick={() => this.getWeather() }><i className="fa fa-fw fa-microphone"></i> Microphone icon here</div>
				</div>



			</div>
		);
	}
});

/*
<div className="g-row">
	<div className="g-col">
		<div className="Button" onClick={() => this.getWeather() }><i className="fa fa-fw fa-calendar"></i> Weather</div>
	</div>

</div>
*/
