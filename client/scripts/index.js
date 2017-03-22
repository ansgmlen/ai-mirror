import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, browserHistory, IndexRoute } from 'react-router'

var CONFIG = {
	dev : {
		endpoint : "http://localhost:3000/",
	},
	prod : {
		endpoint : "http://localhost:3000/",
	},
	currentEnv: {
		endpoint : "http://localhost:3000/",
	}
}
localStorage.setItem('CONFIG', JSON.stringify(CONFIG));


var App = React.createClass({
	componentDidMount: function() {

	},
	render: function() {
		return (
			<div className="page-wrapper">
				<div className="page-body">
				  {this.props.children}
				</div>
				<div className="page-footer">
					<div className="page-container">
						Copyright &copy; 2017 <a href="http://www.google.com/" target="_blank">AI Mirror</a> &middot;
					</div>
				</div>
			</div>
		);
	}
});

const NoMatch = React.createClass({
	render: function(){
		return (
			<div>error</div>
		)
	}
})

ReactDOM.render((
  <Router history={browserHistory}>
    <Route path="/" component={App}>
			<IndexRoute getComponent={ (nextState, cb) => {
				// do asynchronous stuff to find the components
			 cb(null, require('../routes/home/home'))

}} />
		  <Route path="login" component={require('../routes/login/Login')}></Route>
		  <Route path="home" component={require('../routes/home/home')}></Route>
		  <Route path="*" component={NoMatch}/>
    </Route>
  </Router>
), document.getElementById('app'))
