var CONFIG = JSON.parse(localStorage.getItem('CONFIG'));
var q = require("q");

/**
 * getWeather
 * @param
 */
exports.getWeather = function(params) {
    var defer = q.defer();
    var url = CONFIG.currentEnv.endpoint + "getWeather"

    fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            //body: JSON.stringify(params) <-- if it's POST
        }).then((response) => {
            return response.json();
        })
        .then((responseData) => {
            console.log(responseData);
            defer.resolve(responseData);
        }).catch(error => {
            console.log('request failed', error);
            defer.reject(error);
        });

    return defer.promise;

}
