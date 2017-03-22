import React from 'react';
import ReactDOM from 'react-dom';
var CONFIG = JSON.parse(localStorage.getItem('CONFIG'));
var moment = require("moment");
var AnnouncementsService = require("../announcements/AnnouncementsService");

module.exports = React.createClass({
	displayName: 'VIEW_announcement',
	getInitialState: function() {
		return {
			totalCount : 0,
			skip:0,
			limit:10,
			viewName :"",
			hasMore: false,
			items: []
		};
	},
	componentDidMount: function() {
		this.getAnnouncements();
	},
	getAnnouncements: function(){

		var self = this; //requires because inside of callback doesn't know "this" object

		AnnouncementsService.getAnnouncements({
			skip: this.state.skip,
			limit: this.state.limit
		}).then(function(res){

			self.setState({
				totalCount: res.meta.count,
				items : res.response.announcement
			});

		}, function(err){
			console.log(err);
		});

	},
	prev : function(){
		var skip = this.state.skip;
		skip = skip - 10;

		if(skip >= 0){
			this.setState({
				skip : skip,
			}, function(){
				this.getAnnouncements();
			});
		}

	},
	next : function(){
		var skip = this.state.skip;
		skip = skip + 10;

		if(this.state.totalCount > skip){
			//second function as a callback to setState. setState happens asynchronously.
			this.setState({
				skip : skip,
			}, function(){
				this.getAnnouncements();
			});
		}

	},
	openView: function(_viewName) {
		console.log("view name: ", _viewName);
		window.open(CONFIG.currentEnv.endpoint + _viewName, '_self', false); //open home
	},

	loadFunc: function(page){

    console.log("load more!");
		 if(this.state.totalCount > this.state.skip){
		   //this.getAnnouncements(true);
		 }else{
			 //this.setState({hasMore: false});
		 }

  },

	openDetail : function(_id){
		window.open(CONFIG.currentEnv.endpoint + "announcementDetail/" + _id, '_self', false); //open home
	},

	render () {

		var items = []; // row UI container

    this.state.items.map( (item, i) => {
      items.push(
							<tr key={i} onClick={() => this.openDetail(item.id)}>
							  <td><a href="#">{ item.title }</a></td>
							  <td><a href="#">{ moment(item.created_at).format("l") }</a></td>
							</tr>
            );
        });

				/* styles */
				var styles = {
					leftMargin : {
						marginLeft : "10px"
					},
					topMargin : {
            marginTop: "10px",
          },
					scrollContainer:{
						height: "400px",
						//backgroundColor :"red",
						overflow:"auto"
						//lineHeight: "700px",
					}
				}

		return (
			<div className="page-container">
				<h1>Welcome MBBC Admin!</h1>
				<h2 className="u-margin-top-lg">Announcements</h2>
				<div className="row">
				  <div className="itemLeft btn btn-default" onClick={ () => this.openView("createAnnouncement") }>Create</div>
				  <div className="itemLeft btn btn-default" style={styles.leftMargin} onClick={ () => this.openView("home") }>Back</div>
				</div>
				<div style={styles.scrollContainer}>

				</div>

				<div>
				  <button className="btn btn-default" onClick={()=>this.prev()}>Previous</button>
				  <button className="btn btn-default" style={styles.leftMargin} onClick={()=>this.next()}>Next</button>
				</div>

			</div>

		);
	}
});
