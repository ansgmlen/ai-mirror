//var React = require('react/addons');
import React from 'react';
import ReactDOM from 'react-dom';
var CONFIG = JSON.parse(localStorage.getItem('CONFIG'));
var moment = require("moment");
var homeService = require("../home/homeService");

module.exports = React.createClass({
	displayName: 'VIEW_Home',
	getInitialState: function() {
		return {
			viewName :""
		};
	},
	componentDidMount: function() {
		console.log("home loaded");
	},
	openView: function(_viewName) {
		window.open(CONFIG.currentEnv.endpoint + _viewName, '_self', false); //open home
	},

	render () {

		return (
			<div className="page-container">
				<h1>AI Mirror</h1>
				<h2 className="u-margin-top-lg">Home</h2>
				<div className="g-row">
				  <div className="g-col">
					  <div className="Button" onClick={() => this.openView("events") }><i className="fa fa-fw fa-calendar"></i> Events</div>
				  </div>
					<div className="g-col">
						<div className="Button" onClick={() => this.openView("announcements")}><i className="fa fa-fw fa-bullhorn faIcon"></i> Announcements</div>
					</div>
					<div className="g-col">
					  <div className="Button" onClick={ () => this.openView("push") }><i className="fa fa-fw fa-bell-o"></i> Push Notificaion</div>
				  </div>
				</div>
			</div>
		);
	}
});
