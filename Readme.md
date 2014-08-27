#Favket
##Favourites, without the fuss.

Favket is a simple Node script that checks for new favs from your account, and - if they contain a URL - adds that URL to your Pocket (or something else, if you're that way inclined). It then removes the favourite. If you want to make your favourite visible (ie: as a favourite on Twitter), then simply re-fav the tweet after it disappears on Twitter.

###Why is this a thing?
Twitter's changes to how favourites are displayed mean that favouriting has gone from a personal bookmarking service into a more public recommendation, embedded into timelines - almost like a stealthy RT.

###How do I use it?
When you find a tweet with a URL you want to add to your Pocket, simply favourite it. The following happens:  
1. The URL is extracted, and a request is sent to Pocket to add your URL.  
2. The tweet is unfavourited within a second.  
If you want your favourite to be visible, simply refavourite the tweet. The way that Twitter's mobile apps handle favourites mean that the golden star may still appear as if you are still favouriting the tweet, but that isn't the case on their servers - simply tap to remove the star, then tap again to publicly favourite the tweet. 

###Prerequisities
To use Favket, you need to have [Node.js](http://nodejs.org/) and [Heroku Toolbelt](https://toolbelt.heroku.com/) installed on your system. You also need to have [Pocket](https://getpocket.com) and [Twitter](https://twitter.com) accounts in order for the tool to be useful.  

###How do I set it up?
Favket is a Node app configured for Heroku. Here's how to get started:  
1. Clone the repository.  
2. Create a new Heroku instance: `heroku create`.  
3. In *config.js*, edit the Pocket and Twitter authentication details, and add your own. See the "Authenticating with Pocket" and "Authenticating with Twitter" sections below on how to do this.
4. Run `git push heroku master`.  
5. Check one (only one is required) instance of the app is running: `heroku worker:scale web=1`  
6. Voila, you're good to go! Go and test out your shiny new bot out.

###But I don't want to Pocket links from xyz!  
Not a problem. In config.js, simply change `config.excluded` to add the hostnames of the sites you don't ever want to send to your Pocket via a favourite. It's populated with twitter.com by default, so links to tweets aren't sent: you can add more at your will (I'd recommend adding dailymail.co.uk for starters).

###Authenticating with Pocket
1. [Create](http://getpocket.com/developer/apps/new) a new app on the Pocket developer site. It needs to have the "Add" permission, and set the application type to "Extension".
2. After creating the app, find your Consumer Key. In config.js, set the value of `config.pocket.consumer_key` to this value.  
3. Go to [http://reader.fxneumann.de/plugins/oneclickpocket/auth.php](http://reader.fxneumann.de/plugins/oneclickpocket/auth.php), and enter your consumer key.  
4. Follow the prompts, until your access token is displayed to you. Set the value of `config.pocket.access_token` to this value.
5. You're good to go!

###Authenticating with Twitter
1. Go to [Twitter Apps](https://apps.twitter.com/), and click on 'Create New App'. Fill in the details with whatever you want, and click the Create button.  
2. On the app page, go to the API Keys tab. Set the value of `config.twitter.consumer_key` to the value of the 'API key' listing, and the value of `config.twitter.consumer_secret` to the 'API secret' listing.
3. On the same tab, scroll down to Token Actions. Click 'Create my access token'.
4. When the page reloads, set the value of `config.twitter.access_token_key` to the listed value of 'Access token', and the same again for `config.twitter.access_token_secret` and 'Access token secret' respectively.  
5. You're good to go!  

###Next steps
I want to add more read-it-later services to Favket. If you want a hosted version of this service, give me a bell on [Twitter](http://twitter.com/mightyshakerjnr).

###It doesn't work!
Oh no! File an [Issue](https://github.com/hyl/Favket/issues), with a link to the tweet you're trying to favouite. In testing, links from tweets made by *private accounts* aren't saved to Pocket.
