var request = require('request');
var config = require('./config');
var googleApiKey = config.CONFIG.currentEnv.googleApiKey;
var darkSkyKey = config.CONFIG.currentEnv.darkSkyKey;//https://api.darksky.net/forecast/[key]/[latitude],[longitude]
var lat = 32.8025956;
var lng = -97.0891169;

/**
 * getCurrentLocation : with geocoding
 * ex) https://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&key=YOUR_API_KEY
 * @param:
 */
exports.getCurrentLocation = function(req, res) {

  //if lat and lng are exist, change it
  if(req.query && req.query.lat && req.query.lng ){
    lat = req.query.lat;
    lng = req.query.lng;
  }

    request.get({
        url: "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + lng + "&key=" + googleApiKey,
        headers: {
            'ContentType': 'application/json',
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

/**
 * startListen : start google speach
 * @param:
 */
exports.getWeather = function(req, res) {
    request.get({
        url: "https://api.darksky.net/forecast/" + darkSkyKey + "/" + lat + "," + lng,
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
