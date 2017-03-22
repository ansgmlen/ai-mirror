var CONFIG = JSON.parse(localStorage.getItem('CONFIG'));
var q = require("q");

/**
* get announcements
* @param skip{int}, limit{int}
*/
exports.getAnnouncements = function(params) {
  var defer = q.defer();

  var url = CONFIG.appcBasedUrl + "objects/announcement/query.json?key=" + CONFIG.currentEnv.appKey + "&limit=" + params.limit + "&skip=" + params.skip + "&pretty_json=true&count=true";

    fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        //body: JSON.stringify(params)
      }).then((response) => {
        //console.log("first", response);
        return response.json(); // << This is the problem
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

/**
* create announcement
* @param title{string}, description{string}
*/
exports.createAnnouncement = function(params) {
  var defer = q.defer();

  var data = {
      title : params.title,
      description: params.description
  };

  //suppose to pass in url even it's POST method
  var url = CONFIG.appcBasedUrl + "objects/announcement/create.json?key=" + CONFIG.currentEnv.appKey + "&_session_id=" + localStorage.getItem('sessionId') + "&fields=" + JSON.stringify(data) + "&pretty_json=true";

    fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'//'multipart/form-data'//'application/json'
        },
        //body: data//JSON.stringify(data)
      }).then((response) => {
        //console.log("first", response);
        return response.json(); // << This is the problem
      })
      .then((responseData) => {
        console.log("second", responseData);

        if(responseData.meta.code == 200){
          defer.resolve(responseData);
  			}else{
          //TODO if this is fail because of session expired, open login page !!!!
          defer.reject(responseData.meta.message);
  			}

      }).catch(error => {
        console.log('request failed', error);
        defer.reject(error);
      });

      return defer.promise;

}
