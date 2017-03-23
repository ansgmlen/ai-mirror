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
			weatherDesc : ''
		};
	},
	componentDidMount: function() {
		console.log("home loaded");
		this.getWeather();
	},
	openView: function(_viewName) {
		window.open(CONFIG.currentEnv.endpoint + _viewName, '_self', false); //open home
	},
	getWeather : function(){

		var self = this;

		homeService.getWeather().then((res)=>{

			//TODO here is todo for displaying data
			self.setState({
		    //temperature: res
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
						<div style={{color: Defaults.ui.color.white, fontSize:Defaults.ui.fontSize.temperature}}>59°</div>
					</div>
					<div style={{float:'right'}}>
						<Clock name="Clock" UTCOffset="-5"/>
					</div>
				</div>

				<div style={{overflow:'hidden'}}>
					<div style={{float:'left'}}>
						<div style={{color: Defaults.ui.color.white, fontSize:Defaults.ui.fontSize.large}}>Light rain tonight and tomorrow morning</div>
						<div style={{color: Defaults.ui.color.white, fontSize:Defaults.ui.fontSize.large}}>Rain icon here and 30% chance</div>
					</div>
					<div style={{float:'right'}}>
						<div style={{color: Defaults.ui.color.white, fontSize:Defaults.ui.fontSize.large}}>Thursday</div>
						<div style={{color: Defaults.ui.color.white, fontSize:Defaults.ui.fontSize.large}}>January 28</div>
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
						<div style={{color: Defaults.ui.color.white, fontSize:Defaults.ui.fontSize.large}}>Today's schedule</div>
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
