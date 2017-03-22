import React from 'react';
import ReactDOM from 'react-dom';
var CONFIG = JSON.parse(localStorage.getItem('CONFIG'));
var AnnouncementsService = require("../announcements/AnnouncementsService");
import swal from 'sweetalert2';
//var swal = require("sweetalert2");

module.exports = React.createClass({
	displayName: 'VIEW_events',
	getInitialState: function() {
		return {
			viewName :"",
			title : "",
			description: ""
		};
	},
	componentDidMount: function() {
		//initial function here
	},
	changeTitle:function(e){
    this.setState({
	    title: e.target.value
    });
	},
	changeDesc:function(e){
		this.setState({
	    description: e.target.value
    });
	},

	createAnnouncement: function(params){

		if(params && params.title == ""){
			alert("Please type title");
			return;
		}

		var self = this; //requires because inside of callback doesn't know "this" object

		AnnouncementsService.createAnnouncement({
			title: this.state.title,
			description: this.state.description
		}).then(function(res){
		  console.log("data:", res);

			self.setState({
		    title: "",
				description:""
	    });

			swal('Created announcement successfully!','','success');

			setTimeout(function(){
				window.open(CONFIG.currentEnv.endpoint + "announcements", '_self', false);
			}, 2000);


		}, function(err){
			alert("error: " + err);
			console.log(err);
		});

	},
	openView: function(_viewName) {
		window.open(CONFIG.currentEnv.endpoint + _viewName, '_self', false); //open home
	},

	render () {

				/* styles */
				var styles = {
					leftMargin : {
						marginLeft : "10px"
					},
          topMargin : {
            marginTop: "10px",
          },
          textArea : {
            height : "100px",
            marginTop: "10px",
          }
				}

		return (
			<div className="page-container">
				<h1>Welcome MBBC Admin!</h1>
				<h2 className="u-margin-top-lg">Create Announcement</h2>
        <div>
          <input type="text" className="form-input" style={styles.topMargin} placeholder="Title" value={this.state.title} onChange={this.changeTitle}></input>
        </div>
        <textarea className="form-input" style={styles.textArea} placeholder="Description" value={this.state.description} onChange={this.changeDesc}></textarea>
        <div style={styles.topMargin}>
          <button className="btn btn-primary" onClick={() => this.createAnnouncement({title: this.state.title, desc:this.state.description})}>Submit</button>
          <button className="btn btn-primary" style={styles.leftMargin} onClick={()=>this.openView("announcements")}>Cancel</button>
        </div>
			</div>
		);
	}
});
