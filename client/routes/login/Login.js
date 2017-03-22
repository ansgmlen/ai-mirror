import React from 'react';
import ReactDOM from 'react-dom';
var classNames = require('classnames');
//var Colours = require('../mixins/Colours');
//var Defaults = require('../mixins/Defaults');
var LoginService = require("../login/LoginService");
var CONFIG = JSON.parse(localStorage.getItem('CONFIG'));

//module.exports = class Login extends Component {
module.exports = React.createClass({
	displayName: 'VIEW_Login',
	getInitialState: function() {
		return {
			email: "",
			password: "",
			user: {}
		};
	},
	componentDidMount: function() {
		//initial function here
	},
	changeEmail: function(e) {
		console.log(e.target.value);
		this.setState({
			email: e.target.value
		});
	},
	changePassword: function(e) {
		console.log(e.target.value);
		this.setState({
			password: e.target.value
		});
	},

	/**
	 * login
	 * @param - email{string}, password{string}
	 */
	login: function(credentials) {
		LoginService.login(credentials).then(function(res){
			console.log("response: ", res);
			//TODO show sweetalert
			if(res && res.response){
				localStorage.setItem('currentUser', JSON.stringify(res.response.users[0])); //store user info
				localStorage.setItem('sessionId', res.meta.session_id);
				window.open(CONFIG.currentEnv.endpoint + "home", '_self', false); //open home
			}else{
				alert(res.meta.message);
			}
		});

	},


	render() {

		var creds = {
			login : this.state.email,
			password: this.state.password
		}

		var componentStyles = {
			background: 'none',
			border: '1px solid transparent',
			//borderRadius: self.ui.borderRadius.base,
			cursor: 'pointer',
			display: 'inline-block',
			fontWeight: 500,
			//height: self.ui.component.height,
			//lineHeight: self.ui.component.lineHeight,
			marginTop: 10,
			marginBottom: '0',
			overflow: 'hidden',
			//padding: '0 ' + self.ui.component.padding,
			textAlign: 'center',
			touchAction: 'manipulation',
			verticalAlign: 'middle',
			WebkitAppearance: 'none',
			whiteSpace: 'nowrap'
		}

		/*
		    let button = null;
		    if (isLoggedIn) {
		      button = <LogoutButton onClick={this.handleLogoutClick} />;
		    } else {
		      button = <LoginButton onClick={this.handleLoginClick} />;
		    }
		*/

		//this.state = {isToggleOn: true};

		return ( <div className = "page-container" >
			<h1> MBBC  CMS Login </h1> <div>
			<div>
			<input className = "inputField"
			type = "email"
			placeholder = "Email"
			value = {
				creds.email
			}
			onChange = {
				this.changeEmail
			} /></div>
			<div>
			<
			input className = "inputField"
			type = "password"
			placeholder = "Password"
			value = {
				creds.password
			}
			onChange = {
				this.changePassword
			} /> < /
			div > <
			div className = "button"
			style = {
				componentStyles
			}
			>
			<button type = "button" className="btn btn-primary"
			onClick = {
				() => this.login(creds)
			} > Login < /button> < /
			div > <
			/div> < /
			div >
		);
	}
});
