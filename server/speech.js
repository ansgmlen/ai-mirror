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
    keyFilename: 'public/key/smart-mirror-437114bd5f01.json' //'public/key/smart-mirror-3afaae1972f9.json'
});

//1. turn on listening ->

// Start recording and send the microphone input to the Speech API
exports.startListen = function (req, res) {

    // Create a recognize stream : https://cloud.google.com/speech/docs/streaming-recognize
    const recognizeStream = speech.createRecognizeStream({
        config: {
            encoding: 'LINEAR16',
            sampleRate: 16000
        }
    }).on('error', console.error).on('data', (data) => {
            console.log(data.results);
            //process.stdout.write(data.results);

            if (data.results.length > 1) {

                getMessage({
                    message: data.results
                }).then((res) => {
                  console.log("getMessage: ",res);

                  if(res.entities && res.entities.Intent){
                    var val = res.entities.Intent[0].value;
                    if(val == 'greeting'){
                      //TODO: do greeting
                      //make response audio file here and return obj(res) -> client needs to action according to obj
                    }
                  }

                  //res.end("Called");

                  //return getEntity({type : "Weather-Type"});

                }).catch((err)=>{
                  console.log(err);
                });

                //stop and start again when process circle is done
                exports.stopListen();


/*
                if (data.results == "ok mirror") {
                    getFile("Yes, what can I do for you?");
                } else if (data.results.indexOf("how") && data.results.indexOf("are") && data.results.indexOf("you")) {
                    getFile("I am fine. Thank you!");
                } else if (data.results.indexOf("what") > -1 && data.results.indexOf("weather") > -1 && data.results.indexOf("today") > -1 || data.results.indexOf("what") > -1 && data.results.indexOf("weather") > -1 && data.results.indexOf("current") > -1) {
                    getFile("Today weather is sunny");
                } else if (data.results.indexOf("what") > -1 && data.results.indexOf("weather") > -1 && data.results.indexOf("tomorrow") > -1) {
                    getFile("tomorrow weather is cloudy");
                }
                //TODO : 3days/7days forecast
                //how do i look
                //map => direction => traffic
                //news
                else {
                    getFile("Sorry, I don't understand");
                }

                exports.stopListen();
                */

            }else{
              console.log("silence");
            }


        });

    record.start({
        sampleRate: 16000,
        threshold: 0
    }).pipe(recognizeStream);
}


/* stop recording */
exports.stopListen = function(req, res) {
    record.stop();
    res.end();
}



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
                    startListen();
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
        'url': 'https://api.wit.ai/speech?client=chromium&lang=en-us&output=json',
        'headers': {
            'Accept': 'application/vnd.wit.20160202+json',
            'Authorization': 'Bearer ' + config.CONFIG.currentEnv.witToken,
            'Content-Type': 'audio/wav'
        }
    }, function(err, res, body) {
        console.log("Body: ", body); //parseResult
    }));

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
