var request = require('request');
var config = require('./config');
var googleApiKey = config.CONFIG.currentEnv.googleApiKey;
var googleCalendarId = config.CONFIG.currentEnv.googleCalendarId;

/**
 * getSchedule  from google
 * @param:
 */

 /* use a function for the exact format desired... */
 function ISODateString(d){
  function pad(n){return n<10 ? '0'+n : n}
  return d.getUTCFullYear()+'-'
       + pad(d.getUTCMonth()+1)+'-'
       + pad(d.getUTCDate())+'T'
       + pad(d.getUTCHours())+':'
       + pad(d.getUTCMinutes())+':'
       + pad(d.getUTCSeconds())+'Z'
  }

//sample: https://www.googleapis.com/calendar/v3/calendars/heedoo21c%40gmail.com/events?maxResults=10&orderBy=updated&key=
exports.getSchedule = function(req, res) {

  //Get 7days of schedules
  var now = new Date();
  var week = new Date(now.setDate(now.getDate() + 7));

    request.get({
        url: "https://www.googleapis.com/calendar/v3/calendars/" + encodeURIComponent(googleCalendarId) + "/events?maxResults=10&timeMin" + ISODateString(now) + "timeMax" + ISODateString(week) + "&key=" + googleApiKey,
        headers: {
            'Content-Type': 'application/json',
        },
    }, function(err, response, body) {
        if (!err && response.statusCode == 200) {
            var json = JSON.parse(response.body);

            res.send(json);
        } else {
            res.send(err);
        }
    });

};
