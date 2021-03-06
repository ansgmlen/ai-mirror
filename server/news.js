var request = require('request');
var config = require('./config');
var newsapiKey = config.CONFIG.currentEnv.newsapi;
var json = {};
/**
 * get news from google news feed
 * @param: news_country_code
 */
exports.getNews = function(req, res) {
    request.get({
        url: "https://newsapi.org/v1/articles?source=google-news&apiKey=" + newsapiKey,
        headers: {
            'Content-Type': 'application/json',
        },
    }, function(err, response, body) {
        if (!err && response.statusCode == 200) {
            json = JSON.parse(response.body);
            res.send(json);
        } else {
            res.send(err);
        }
    });

};

/* just return current news data */
exports.getJSON = function(){
  return json;
}
