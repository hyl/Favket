var util    = require('util'),
    url     = require('url'),
    async   = require('async'),
    twitter = require('twitter'),
    pocket  = require('pocket-api'),
    config  = require('./config');

//get ready for making Twitter requests
var twitter = new twitter({
    consumer_key: config.twitter.consumer_key,
    consumer_secret: config.twitter.consumer_secret,
    access_token_key: config.twitter.access_token_key,
    access_token_secret: config.twitter.access_token_secret
});

//array for tweet IDs
var pocketedTweets = [],
    debugMode      = false;

twitter.stream('user', {
    with: 'user'
}, function(stream) {
    stream.on('data', function(data) {
        async.waterfall([
            function(callback){
                //Check if the event is a favourite, the event comes from your username, and if the tweet has a url. If not jump out
                callback((data.event == 'favorite' && data.source.screen_name == config.twitter.username && data.target_object.entities.urls) ? null : 'fail');
            },
            function(callback){
                var urlToPocket = data.target_object.entities.urls[0].expanded_url;

                //Check if the URL is excluded or the tweet has already been handled
                callback((pocketedTweets.indexOf(data.target_object.id_str) === -1 && config.excluded.indexOf(url.parse(urlToPocket).hostname) === -1) ? null : 'fail', urlToPocket);
            },
            function(urlToPocket, callback){
                var tweetID = data.target_object.id_str;

                console.log('Adding tweet to pocket..');
                //add to pocket
                pocket.addArticles(urlToPocket, config.pocket.consumer_key, config.pocket.access_token, function(error, data) {
                    if (error) {
                        return callback(error);
                    }

                    //push tweet id to array
                    pocketedTweets.push(tweetID);
                    //remove favourite
                    twitter.post('/favorites/destroy.json', {
                        id: tweetID,
                        include_entities: false
                    }, null, function(data) {
                        callback(true);
                    });
                });
            }
        ], function (res) {
            if (res === 'fail') {
                if (debugMode) console.log('Didn\'t add tweet to pocket since it didn\'t match criteria');
            } else if(res === true) {
                 if (debugMode) console.log('Successfully added tweet to pocket: (' + data.target_object.id_str + ').');
            } else {
                console.error('Funky stuff happened and we crashed out: ' + res);
            }

        });
    });
});
