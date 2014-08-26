var config = require('./config');

var util = require('util'),
    twitter = require('twitter'),
    pocket = require('pocket-api');

//get ready for making Twitter requests
var twitter = new twitter({
    consumer_key: config.twitter.consumer_key,
    consumer_secret: config.twitter.consumer_secret,
    access_token_key: config.twitter.access_token_key,
    access_token_secret: config.twitter.access_token_secret
});

//array for tweet IDs
var pocketedTweets = [];

//search arrays
function include(arr, obj) {
    return (arr.indexOf(obj) != -1);
};

//split URLs
function getHostname(url) {
    var match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);
    if (match != null && match.length > 2 && typeof match[2] === 'string' && match[2].length > 0) {
        return match[2];
    } else {
        return null;
    }
};

twitter.stream('user', {
    with: 'user'
}, function(stream) {
    stream.on('data', function(data) {
        //check if the event is a favo(u)rite
        if (data.event == 'favorite') {
            //check if the tweet contains a URL
            if (data.target_object.entities.urls != '') {
                var urlToPocket = data.target_object.entities.urls[0].expanded_url;
                //check if we've dealt with the favourite before. Only act if we haven't - favouriting twice means the favourite is actually added.
                if (include(pocketedTweets, data.target_object.id_str) != true) {
                    //check if URL is one the user has excluded: if not, carry on with the Pocketing
                    if (include(config.excluded, getHostname(data.target_object.entities.urls[0].expanded_url)) != true) {
                        console.log('Tweet to be added to Pocket');
                        //add to pocket
                        pocket.addArticles(urlToPocket, config.pocket.consumer_key, config.pocket.access_token, function(error, data) {
                            console.log(error);
                        });
                        //push tweet id to array
                        pocketedTweets.push(data.target_object.id_str);
                        //remove favourite
                        twitter.post('/favorites/destroy.json', {
                            id: data.target_object.id_str,
                            include_entities: false
                        }, null, function(data) {
                            console.log(data);
                        });
                    }
                }
            }
        }
    });
});
