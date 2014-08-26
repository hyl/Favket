//root holder
var config = {};

//URLs that you don't want to Pocket. Only contains twitter.com by default (so fav'd links to tweets aren't Pocketed)
config.excluded = [
  'twitter.com'
]

//Twitter details
config.twitter = {};
//Twitter consumer key
config.twitter.consumer_key = 'consumer_key';
//Twitter consumer secret
config.twitter.consumer_secret = 'consumer_secret';
//Twitter access token key
config.twitter.access_token_key = 'access_token_key';
//Twitter access token secret
config.twitter.access_token_secret = 'access_token_secret';

//Pocket details
config.pocket = {};
//Pocket consumer key
config.pocket.consumer_key = 'consumer_key';
//Pocket access token, go to http://reader.fxneumann.de/plugins/oneclickpocket/auth.php to retrieve
config.pocket.access_token = 'access_token';

//Make the config accessible inside app.js
module.exports = config;
