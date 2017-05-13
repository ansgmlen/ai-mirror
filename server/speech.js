"use strict";
var request = require('request');
var config = require('./config');
const record = require('node-record-lpcm16');
var fs = require('fs');
var googleTTS = require('google-tts-api'); //https://github.com/zlargon/google-tts/blob/master/example/download.js
require('es6-promise').polyfill();
var path = require('path');
var http = require('http');
var https = require('https');
var urlParse = require('url').parse;
var player = require('play-sound')()
const Speech = require('@google-cloud/speech');
const speech = Speech({
    projectId: config.CONFIG.currentEnv.googleProjectId,
    keyFilename: 'public/key/smart-mirror-3afaae1972f9.json' //'public/key/smart-mirror-437114bd5f01.json'
});
var io = require('socket.io');
var socketClient = {};
var News = require("./news");

exports.startSocket = function(client) {
    console.log("start socket.io in speech.js");
    socketClient = client;
    //startRecord();
    //exports.startListen();
};

/** Start recording using lpcm16 module with wit.ai */
function startRecord() {
  console.log("start listening");
    record.start().pipe(request.post({
            'url': 'https://api.wit.ai/speech?v=20160526',
            'headers': {
                'Accept': 'application/vnd.wit.20160202+json',
                'Authorization': 'Bearer ' + config.CONFIG.currentEnv.witToken,
                'Content-Type': 'audio/wav'
            }
        }, function(err, res, body) {
            console.log(body); //parseResult
            response(JSON.parse(body));
        })
    );
}

/**
* response
* @param - params{object}: speech to text object from wit.ai
*/
function response(params) {

  var emitObj = {}; //when socket is emitting, it sends emitObj data

  try {

      if (params._text.indexOf("close") > -1) {
        emitObj = {
            type: 'closeModal',
            action: 'closeModal',
            url: '',
            text: params._text,
            answer: "Okay"
        };
        socketClient.emit('receiveCommand', emitObj);
      }
      else if(params._text.indexOf("ok") > -1 && params._text.indexOf("emily") > -1){
        emitObj = {
            type: 'appearence',
            action: '',
            url: '',
            text: params._text,
            answer: "Yes, Heedoo what can i do for you"
        };
        socketClient.emit('receiveCommand', emitObj);
      }
      else if(params._text.indexOf("how") > -1&&params._text.indexOf("i") > -1&&params._text.indexOf("look") > -1){
        emitObj = {
            type: 'appearence',
            action: '',
            url: '',
            text: params._text,
            answer: "You look awesome!"
        };
        socketClient.emit('receiveCommand', emitObj);
      }
      else if (params.entities && params.entities.Intent) {

          if (params.entities.Intent[0].value == "news") {

            var newsObj = News.getJSON();

            emitObj = {
                type: 'news',
                action: 'openUrl',
                url: newsObj.articles[0].url,
                text: params._text,
                answer: "Sure, here is today news"
            };

            if(params._text.indexOf("first") > -1){
              emitObj.url = newsObj.articles[0].url;
            }else if(params._text.indexOf("second") > -1){
              emitObj.url = newsObj.articles[1].url;
            }else if(params._text.indexOf("third") > -1){
              emitObj.url = newsObj.articles[2].url;
            }else if(params._text.indexOf("fouth") > -1){
              emitObj.url = newsObj.articles[3].url;
            }else if(params._text.indexOf("fifth") > -1){
              emitObj.url = newsObj.articles[4].url;
            }

            socketClient.emit('receiveCommand', emitObj);
          }

      }
      else if (params.entities && params.entities.calendar) {
        emitObj = {
            type: 'calendar',
            action: 'openUrl',
            url: 'https://calendar.google.com/calendar/embed?src=heedoo21c%40gmail.com&ctz=America/New_York',
            text: params._text,
            answer: "Sure here is your calendar"
        };
        socketClient.emit('receiveCommand', emitObj);
      } else {
        console.log("nothing else");
        startRecord();

      }

      //speak here and if ai doesn't understand, record voice again
      if(emitObj && emitObj.answer){
        getFile(emitObj.answer);
      }else{
      //
      }



  } catch (caught) {
      console.log("caught: ", caught);
  }

  //startRecord();

}


/* stop recording */
exports.stopListen = function(req, res) {
    console.log("stop listen");
    record.stop();
    //res.end();
}


/*
// Start recording and send the microphone input to the Speech API
exports.startListen = function(req, res) {

    // Create a recognize stream : https://cloud.google.com/speech/docs/streaming-recognize
    const recognizeStream = speech.createRecognizeStream({
        config: {
            encoding: 'LINEAR16',
            sampleRate: 16000
        }
    }).on('error', console.error).on('data', (data) => {
        //process.stdout.write(data.results);

        if (data.results.length > 1) {

            getMessage({
                message: data.results
            }).then((response) => {

                console.log("getMessage: ", response);

                var json = JSON.parse(response);

                try {

                    if (json._text.indexOf("close") > -1 || json._text.indexOf("clothes") > -1) {
                        socketClient.emit('receiveCommand', {
                            type: 'closeModal',
                            action: 'closeModal',
                            url: '',
                            text: json._text,
                            answer: "Okay"
                        });
                    } else if (json.entities && json.entities.Intent) {

                        if (json.entities.Intent[0].value == "news") {
                            socketClient.emit('receiveCommand', {
                                type: 'news',
                                action: 'openUrl',
                                url: '',
                                text: json._text,
                                answer: "Sure"
                            });
                        }

                    } else if (json.entities && json.entities.calendar) {
                        //speak show calendar
                        socketClient.emit('receiveCommand', {
                            type: 'calendar',
                            action: 'openUrl',
                            url: 'https://calendar.google.com/calendar/embed?src=heedoo21c%40gmail.com&ctz=America/New_York',
                            text: json._text,
                            answer: "Sure here is your calendar"
                        });
                    } else {

                    }

                    //2. display this week schedule

                } catch (_error) {
                    console.log(_error);
                }

                exports.startListen();

            }).catch((err) => {
                console.log(err);
            });

            //stop and start again when process circle is done
            exports.stopListen();


        } else {
            console.log("silence");
        }


    });

    record.start({
        sampleRate: 16000,
        threshold: 0
    }).pipe(recognizeStream);

}
*/




/**
 * get google translate url
 * @param - text{string}
 */
function getFile(text) {
    googleTTS(text, 'en', 1) // speed normal = 1 (default), slow = 0.24
        .then(function(url) {
            console.log(url); // https://translate.google.com/translate_tts?...

            //TODO : These two lines for creating mp3 files. Now I am not using these so commented out
            var dest = path.resolve('public/audio', 'voice.mp3'); // file destination
            return downloadFile(url, dest); //<-- promise

            //return url;

        }).then(function() {
            console.log('Download success');

            player.play('public/audio/voice.mp3', function(err) {
                if (err) {
                    console.log("err: " + err);
                } else {
                    //startListen();
                    startRecord();
                }
            })

        }).catch(function(err) {
            console.error(err.stack);
        });

}

/**
 * download mp3 file from google translate
 * @param - url{string}, dest{string}
 */
function downloadFile(url, dest) {

    return new Promise(function(resolve, reject) {
        var info = urlParse(url);
        var httpClient = info.protocol === 'https:' ? https : http;
        var options = {
            host: info.host,
            path: info.path,
            headers: {
                'user-agent': 'WHAT_EVER'
            }
        };

        httpClient.get(options, function(res) {
                // check status code
                if (res.statusCode !== 200) {
                    reject(new Error('request to ' + url + ' failed, status code = ' + res.statusCode + ' (' + res.statusMessage + ')'));
                    return;
                }

                var file = fs.createWriteStream(dest);
                file.on('finish', function() {
                    // close() is async, call resolve after close completes.
                    file.close(resolve);
                });
                file.on('error', function(err) {
                    // Delete the file async. (But we don't check the result)
                    fs.unlink(dest);
                    reject(err);
                });

                res.pipe(file);
            })
            .on('error', function(err) {
                reject(err);
            }).end();

    });
}


/**
 * get message - if client send message, it will find entity and return
 * @param message{string} //ex: 'https://api.wit.ai/message?v=20160526&q=what%20is%20the%20weather%20today'
 */
function getMessage(params) {

    return new Promise(function(resolve, reject) {

        var url = 'https://api.wit.ai/message?v=20160526&q=' + encodeURIComponent(params.message);

        request.get({
            'url': url,
            'headers': {
                'Authorization': 'Bearer ' + config.CONFIG.currentEnv.witToken,
            }
        }, function(err, res) {
            if (err) {
                console.log("err: ", err);
                reject(err);
            } else {
                resolve(res.body);
            }
        });

    });

}

/**
 * get entities values
 * @param type{string} : ex) Weather-Type
 * @return entity object{object} : ex) res.values{array} - [{"value" : "3 day","expressions" : [ "what's the three day forecast", "what's the forecast for the next few days" ]}
 */
function getEntity(params) {
    request.get({
        'url': 'https://api.wit.ai/entities/' + params.type + '?v=20160526',
        'headers': {
            'Authorization': 'Bearer ' + config.CONFIG.currentEnv.witToken,
        }
    }, function(err, res) {
        if (err) {
            console.log("err: ", err);
        } else {
            console.log("res: ", res.body);
        }
    });
}

/**
 * wit.ai speech to text api
 * @param witToken{string}
 */
exports.witSpeechToText = function(req, res) {
    var file = fs.createWriteStream('public/audio/test.wav', {
        encoding: 'binary'
    })

    record.start().pipe(request.post({
              'url': 'https://api.wit.ai/speech?v=20160526',
              'headers': {
                  'Accept': 'application/vnd.wit.20160202+json',
                  'Authorization': 'Bearer ' + config.CONFIG.currentEnv.witToken,
                  'Content-Type': 'audio/wav'
              }
          }, function(err, res, body) {
              console.log("Body: ", JSON.parse(body)); //parseResult
          }));

          /* This api is depricated
          record.start().pipe(request.post({
              'url': 'https://api.wit.ai/speech?client=chromium&lang=en-us&output=json',
              'headers': {
                  'Accept': 'application/vnd.wit.20160202+json',
                  'Authorization': 'Bearer ' + config.CONFIG.currentEnv.witToken,
                  'Content-Type': 'audio/wav'
              }
          }, function(err, res, body) {
              console.log("Body: ", body); //parseResult
          }));
          */

}

exports.getConverse = function(req, res) {
    request.post({
        'url': 'https://api.wit.ai/converse?v=20160526&session_id=123&q=what%20is%20the%20weather%20today', //'https://api.wit.ai/speech?client=chromium&lang=en-us&output=json',
        'headers': {
            'Authorization': 'Bearer ' + config.CONFIG.currentEnv.witToken,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        'body': {}
    }, function(err, res) {

        if (err) {
            console.log("err: ", err);
        } else {
            console.log("res: ", res.body);
        }

    });
}
