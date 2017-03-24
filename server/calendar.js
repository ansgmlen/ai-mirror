var request = require('request');
var config = require('./config');
var googleApiKey = config.CONFIG.currentEnv.googleApiKey;

/**
 * getSchedule  from google
 * @param: news_country_code
 */
exports.getSchedule = function(req, res) {
    request.get({
        url: "https://newsapi.org/v1/articles?source=cnn&apiKey=" + googleApiKey,
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
