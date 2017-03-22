import React from 'react';
import ReactDOM from 'react-dom';
var CONFIG = JSON.parse(localStorage.getItem('CONFIG'));
var AnnouncementsService = require("../announcements/AnnouncementsService");
import moment from "moment";
var swal = require("sweetalert2");

module.exports = React.createClass({
	displayName: 'VIEW_events',
	getInitialState: function() {
		return {
			viewName :"",
			title : "",
			description: "",
      createdAt : ""
		};
	},
	componentDidMount: function() {
		//initial function here
    var passedId = this.props.params.id; //passed id from announcement page url param
    this.getAnnouncement(passedId);
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
	getAnnouncement: function(_id){

		var self = this; //requires because inside of callback doesn't know "this" object

		AnnouncementsService.getAnnouncement(_id).then(function(res){

			self.setState({
		    title: res.response.announcement[0].title,
				description:res.response.announcement[0].description,
        createdAt: moment(res.response.announcement[0].created_at).format("lll")
	    });


		}, function(err){
			alert("error: " + err);
			console.log(err);
		});

	},
  updateAnnouncement: function(params){

		if(params && params.title == ""){
			alert("Please type title");
			return;
		}

		var self = this; //requires because inside of callback doesn't know "this" object

		AnnouncementsService.updateAnnouncement(params).then(function(res){

      self.setState({
		    title: res.response.announcement[0].title,
				description:res.response.announcement[0].description,
        createdAt: moment(res.response.announcement[0].created_at).format("lll")
	    });

			swal('Announcement update successfully!','','success');

			setTimeout(function(){
				window.open(CONFIG.currentEnv.endpoint + "announcements", '_self', false);
			}, 2000);

		}, function(err){
			alert("error: " + err);
			console.log(err);
		});

	},
	showDialog: function(_id){

		var self = this;

		//TODO diallog
		swal({
  title: 'Delete',
  text: 'Are you sure do you want to delete announcement?',
  type: 'warning',
  showCancelButton: true,
  confirmButtonText: 'Yes, delete it!',
  cancelButtonText: 'No, keep it'
}).then(function() {

	self.deleteAnnouncement(_id);

}, function(dismiss) {
  // dismiss can be 'overlay', 'cancel', 'close', 'esc', 'timer'
});

	},
	deleteAnnouncement: function(_id){

		var self = this; //requires because inside of callback doesn't know "this" object

		AnnouncementsService.deleteAnnouncement(_id).then(function(res){

			swal('Deleted successfully!','','success');

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
				<h2 className="u-margin-top-lg">Announcement</h2>
				<div className="row">
					<div className="itemLeft btn btn-default" onClick={ () => this.openView("announcements") }>Back</div>
				</div>
        <div style={styles.topMargin}>Created At: {this.state.createdAt}</div>
        <div>
          <input type="text" className="form-input" style={styles.topMargin} placeholder="Title" value={this.state.title} onChange={this.changeTitle}></input>
        </div>
        <textarea className="form-input" style={styles.textArea} placeholder="Description" value={this.state.description} onChange={this.changeDesc}></textarea>
        <div style={styles.topMargin}>
          <button className="btn btn-primary" onClick={() => this.updateAnnouncement({id: this.props.params.id, title: this.state.title, description:this.state.description})}>Update</button>
          <button className="btn btn-primary" style={styles.leftMargin} onClick={()=>this.showDialog(this.props.params.id)}>Delete</button>
        </div>
			</div>
		);
	}
});
