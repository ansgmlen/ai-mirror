var CONFIG = JSON.parse(localStorage.getItem('CONFIG'));
var q = require("q");
/**
* login
* @param email{string}, password{string}
* ex) http://stackoverflow.com/questions/33237200/fetch-response-json-gives-responsedata-undefined
*/
exports.login = function(credentials) {
  var defer = q.defer();

  // credentials = {
  //   login : "mbbc.app@gmail.com",
  //   password : "mbbc8001"
  // }

  var url = CONFIG.appcBasedUrl + "users/login.json?key=" + CONFIG.currentEnv.appKey + "&pretty_json=true";

    fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      }).then((response) => {
        return response.json(); // << This is the problem
      })
      .then((responseData) => {
        console.log("second", responseData);
        defer.resolve(responseData);
      }).catch(error => {
        console.log('request failed', error);
        defer.reject(error);
      });

      return defer.promise;

}
//For Logout
//localStorage.clear();
//localStorage.removeItem("currentUser");

/**
* authentication when app starts
*
*/
exports.showMe = function() {
  var defer = q.defer();

  var initConfig = {
  	appcBasedUrl: "https://api.cloud.appcelerator.com/v1/",
  	dev : {
  		appKey : "v6YkxpBSPeILA8yS3t51QApDkTA7FWp6",
  		endpoint : "http://localhost:8000/",
  	},
  	prod : {
  		appKey : "aCCni5ANu4kESVLVvEtv9hLkYZieULmu",
  		endpoint : "https://mbbc-webservice.herokuapp.com/",
  	},
  	currentEnv: {
  		appKey : "aCCni5ANu4kESVLVvEtv9hLkYZieULmu",
  		endpoint : "http://localhost:8000/"
  	}
  }

  //when app starts and makes showMe api, app doesn't recognized CONFIG value yet so changed to actual url instead of reference.
  var url = initConfig.appcBasedUrl + "users/show/me.json?key=" + initConfig.currentEnv.appKey + "&_session_id=" + localStorage.getItem('sessionId') + "&pretty_json=true";
    fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        return response.json(); // << This is the problem
      }).then((responseData) => {

        if(responseData.meta.status == "fail"){
          defer.reject(responseData);
        }else{
          defer.resolve(responseData);
        }

      }).catch(error => {
        console.log('request failed', error);
        defer.reject(error);
      });

      return defer.promise;

}
