import React from 'react';
import ReactDOM from 'react-dom';
var moment = require("moment");
var Defaults = require('../mixins/Defaults');

module.exports = React.createClass({
  setTime: function(){

  	var currentdate = new Date();

  	var hours = currentdate.getUTCHours() + parseInt(this.props.UTCOffset);

      // correct for number over 24, and negatives
      if( hours >= 24 ){ hours -= 24; }
      if( hours < 0   ){ hours += 12; }

      // add leading zero, first convert hours to string
      hours = hours + "";
      if( hours.length == 1 ){ hours = "0" + hours; }

      // minutes are the same on every time zone
      var minutes = currentdate.getUTCMinutes();

      // add leading zero, first convert hours to string
      minutes = minutes + "";
      if( minutes.length == 1 ){ minutes = "0" + minutes; }

      //seconds = currentdate.getUTCSeconds();
      //console.log(hours, minutes, seconds);

      var time;
      //am or pm
      if(hours > 12){
        hours = parseInt(hours) - 12;
        time = hours + ":" + minutes + " pm";
      }else{
        time = hours + ":" + minutes + " am";
      }

      this.setState({
      	hours: hours,
        minutes: minutes,
        //seconds: seconds
        time : time
      });
  },
  componentWillMount: function(){
  	this.setTime();
  },
  componentDidMount: function(){
  	 window.setInterval(function () {
      this.setTime();
    }.bind(this), 1000);
  },
  render: function() {
		//{this.state.seconds}
    return(
      <div className="city-row" ref="cityRow">
        <span className="city-time" style={{color:Defaults.ui.color.white, fontSize:Defaults.ui.fontSize.clock, fontFamily:Defaults.ui.fontFamily.theme}}>{this.state.time}</span>
      </div>
    )
  }
});
