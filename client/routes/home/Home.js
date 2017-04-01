import React from 'react';
import ReactDOM from 'react-dom';
var CONFIG = JSON.parse(localStorage.getItem('CONFIG'));
var moment = require("moment");
var homeService = require("../home/homeService");
var Defaults = require('../../mixins/Defaults');
var Clock =  require('../../../client/components/clock');
var Popup =  require('../../../client/components/popup');

import io from 'socket.io-client';
var socket = io('http://localhost:3000');

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
			dailyWeather : [],
			newsFeed : [],
			schedules : [],
			isShow : false,
			selectedUrl : '',
			currentCommand : '',
			answer : ''
		};
	},
	componentDidMount: function() {
		var self = this;
		this.getWeather();
		this.getNews();
		this.getSchedule();

		socket.on('receiveCommand', function(data) {
				console.log("receiveCommand: ", data);
				self.setState({
					answer : data.answer,
					isShow: true
				}, function(){
					setTimeout(function(){
						self.setState({isShow:false});
					}, 5000);
				});
				self.handleCommand(data);
		});

	},

	/* handle voice command */
	handleCommand: function(_data){

		if(_data.type == "calendar" || _data.type == "news"){
			this.getUrl(_data.url, _data.text);
		}else if(_data.type == "weather"){

		}else if(_data.type == "closeModal"){
			this.closeModal();
		}else{
			//this.closeModal();
		}

	},

	openView: function(_viewName) {
		window.open(CONFIG.currentEnv.endpoint + _viewName, '_self', false); //open home
	},
	lookupIcon:function(_icon){
		var path = "";
		var icons = [{type:'clear-day',path :"images/weather/Sun.png"},//# clear sky day
		{type:'wind',path :"images/weather/Wind.png"},//#wind
		{type:'cloudy',path :"images/weather/Cloud.png"},//#cloudy day
		{type:'partly-cloudy-day',path :"images/weather/PartlySunny.png"},//# partly cloudy day
		{type:'rain',path :"images/weather/Rain.png"},
		{type:'snow',path :"images/weather/Snow.png"},
		{type:'snow-thin',path :"images/weather/Snow.png"},
		{type:'fog',path :"images/weather/Haze.png"},
		{type:'clear-night',path :"images/weather/Moon.png"},
		{type:'partly-cloudy-night',path :"images/weather/PartlyMoon.png"},
		{type:'thunderstorm',path :"images/weather/Storm.png"},
		{type:'tornado',path :"images/weather/Tornado.png"},
		{type:'hail',path :"images/weather/Hail.png"}];

		for(var i in icons){
			if(icons[i].type == _icon){
				path = icons[i].path;
			}
		}

		return path;

	},
	getWeather : function(){

		var self = this;
		var now = new Date();

		homeService.getWeather().then((res)=>{

			self.setState({
		    temperature: Math.round(parseFloat(res.currently.temperature)),
				weatherIcon : self.lookupIcon(res.currently.icon),
				weatherCurrentSummary: res.currently.summary,
				weatherDailySummary : res.daily.summary,
				dailyWeather : res.daily.data,
				day : moment(now).format('dddd'),
				date : moment(now).format('ll'),
				timer : 0
	    });

		}, (err)=>{
			console.log(err);
		});
	},
	getNews : function(){
		var self = this;
		homeService.getNews().then((res)=>{
			self.setState({
				newsFeed: res.articles
		  });
		}, (err)=>{
			console.log(err);
		});
	},

	getUrl :function(_url, command){
		this.state.selectedUrl = _url;
		this.openModal(this.state.selectedUrl);
	},

	getSchedule : function(){

		var self = this;

		homeService.getSchedule().then((res)=>{
			 self.setState({
				 schedules : res.items
	    });
		}, (err)=>{
			console.log(err);
		});
	},

	openModal : function(_url){
		var w = 700;
		var h = 700;
		Popup.show(_url, "Popup window", w, h);
	},

	closeModal : function(){
		Popup.close();
	},

	render () {

		var items = []; // row UI container
		var scheduleList = []; // row UI container
		var dailyWeatherBox = [];

		this.state.newsFeed.map( (item, i) => {
			if(i < 5){
				items.push(
					<tr key={i} style={{color:Defaults.ui.color.white, fontSize:'13px'}}>
						<td>{"∙ " + item.title}</td>
				  </tr>
			    );
			}
		});

		this.state.schedules.map( (schedule, x) => {
			scheduleList.push(
				<tr key={x} style={{color:Defaults.ui.color.white, fontSize:'13px'}}>
					<td>{"∙ " + moment(schedule.start.dateTime).format('ll')} {schedule.summary}</td>
				</tr>
				);
		});


		this.state.dailyWeather.map( (_daily, j) => {

			dailyWeatherBox.push(
				<div key={j} style={{float:'left', width:'35px', height:'80px'}}>
					<div style={{color:Defaults.ui.color.white, fontSize:'12px', textAlign:"center"}}>{moment(_daily.time*1000).format("ddd")}</div>
					<div><img style={{width:'20px', height:'20px', marginLeft:'5px'}} src={this.lookupIcon(_daily.icon)}></img></div>
					<div style={{color:Defaults.ui.color.white, fontSize:'12px', align:'center', textAlign:"center"}}>
						<spen>{Math.round(parseFloat(_daily.temperatureMax))} </spen> <spen style={{opacity:0.7}}>{Math.round(parseFloat(_daily.temperatureMin))} </spen>
					</div>
				</div>
			);
		});

		var styles = {
			answer:{
				visibility: this.state.isShow ? 'visible' : 'hidden',
				display: 'flex',
				justifyContent: 'center',
				color:'#fff',
				fontSize:'45px',
				marginTop:'35%'
			}
		}


		//display: 'none'


		return (
			<div className="page-container">

				<div style={{overflow:'hidden'}}>
					<div style={{float:'left'}}>
						<div style={{color: Defaults.ui.color.white, fontSize:Defaults.ui.fontSize.temperature}} onClick={()=>{this.getUrl()}}>{this.state.temperature}°</div>
					</div>
					<img style={{float:'left', marginLeft:'20px', color: Defaults.ui.color.white, width:'80px', height:'80px'}} src={this.state.weatherIcon} onClick={()=>{this.closeModal()}}></img>
					<div style={{float:'right'}}>
						<Clock name="Clock" UTCOffset="-5"/>
					</div>
				</div>

				<div style={{overflow:'hidden'}}>
					<div style={{float:'left', width:'40%'}}>
						<div style={{color: Defaults.ui.color.white, fontSize:Defaults.ui.fontSize.large, marginTop:'10px'}}>{this.state.weatherCurrentSummary} </div>
						<div style={{overflow:'hidden', marginTop:'10px'}}>
							{dailyWeatherBox}
						</div>
					</div>
					<div style={{float:'right'}}>
						<div style={{color: Defaults.ui.color.white, fontSize:Defaults.ui.fontSize.large, textAlign:'right'}}>{this.state.day}</div>
						<div style={{color: Defaults.ui.color.white, fontSize:Defaults.ui.fontSize.large}}>{this.state.date}</div>
					</div>
				</div>

				<div style={styles.answer} >
					 <div >{this.state.answer}</div>
				</div>

				<div style={{overflow:'hidden', marginTop:'35%', color: Defaults.ui.color.white, fontSize:Defaults.ui.fontSize.xLarge}}>
					<div style={{float:'left', width: '45%'}}>
						<table>
							<tbody>
							  {items}
						  </tbody>
						</table>
					</div>

					<div style={{float:'right'}}>
						<div style={{color: Defaults.ui.color.white, fontSize:Defaults.ui.fontSize.large, textAlign:'center'}}>My Schedule</div>
							<table style={{marginTop:'10px'}}>
								<tbody>
								  {scheduleList}
							  </tbody>
							</table>
					</div>

				</div>

				<div style={{marginTop:'15px', display: 'flex', justifyContent: 'center'}}>
					<div className="" style={{color: Defaults.ui.color.white, fontSize:Defaults.ui.fontSize.clock}} onClick={() => this.getWeather() }><i className="fa fa-fw fa-microphone" style={{color: Defaults.ui.color.white}}></i></div>
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
