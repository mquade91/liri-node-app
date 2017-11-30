//Pulls over keys//
var keys = require("./keys.js");
//takes user input to determine which NPM will run
var command = process.argv[2];
//Using this to pull from random.txt 
var request = require("request");
var fs = require("fs");

function logToConsoleAndFile(message) {
    console.log(message)
    fs.appendFile("log.txt", message + "\n", function(err) {
        // If the code experiences any errors it will log the error to the console.
        if (err) {
            return console.log(err);
        }
    });
}

//spotify keys
var Spotify = require('node-spotify-api');
var spotify = new Spotify({
    id: keys.spotifyKeys.id,
    secret: keys.spotifyKeys.secret
});
//twitter keys
var Twitter = require('twitter');
var client = new Twitter(keys.twitterKeys);


//node liri.js my-tweets
//This will show your last 20 tweets and when they were created at in your terminal/bash window.
if (command === "my-tweets") {
    var params = { count: 20 };
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            for (var i = 0; i < tweets.length; i++) {
                logToConsoleAndFile("Time of Tweet: " + tweets[i].created_at);
                logToConsoleAndFile("Tweet Text: " + tweets[i].text);
                logToConsoleAndFile("");
                // console.log(tweets);
            }
        }
        else {
            console.log(error);
        }

    });

}

//node liri.js spotify-this-song //

else if (command === "spotify-this-song") {

    var songName = process.argv[3];
    if (songName == undefined) {
        songName = "The Sign by Ace of Base";
        logToConsoleAndFile("No user input for the Song Name. Default is 'The Sign' by Ace of Base");
    }
    // second way to try and get info from API//
    spotify.search({ type: 'track', query: songName, limit: 1, }, function(err, data) {
        if (err) {
            return console.log('Error occured' + err);
        }
        // console.log(JSON.stringify(data, null, 1));
        var string = JSON.stringify;
        // Artist Name(s)
        logToConsoleAndFile("Artist Name: " + string(data.tracks.items[0].album.artists[0].name, null, 4));
        //Song Name from Spotify API
        logToConsoleAndFile("Song Name: " + string(data.tracks.items[0].name));
        // A preview link of the song from Spotify, if there is no preview available let user know
        if (data.tracks.items[0].preview_url === null) {
            console.log("There is no 'Preview URL' available from Spotify for " + string(data.tracks.items[0].name));
        }
        else {
            logToConsoleAndFile("Preview Link: " + string(data.tracks.items[0].preview_url, null, 2));
        }
        // // The Album's name
        logToConsoleAndFile("Album Name: " + string(data.tracks.items[0].album.name, null, 4));

    });

}


// node liri.js movie-this 'movie name here'//

else if (command === "movie-this") {
    var movieName = process.argv[3];
    if (movieName == undefined) {
        movieName = "Mr. Nobody";
        logToConsoleAndFile("No user input for the Movie Name. Default is 'Mr.Nobody");
    }
    var queryUrl3 = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
    request(queryUrl3, function(error, response, body) {



        // If the request is successful (i.e. if the response status code is 200)
        if (!error && response.statusCode === 200) {

            // Parse the body of the site and recover just the imdbRating
            var mBody = JSON.parse(body);
            logToConsoleAndFile("Movie Title: " + mBody.Title);
            logToConsoleAndFile("Release Year: " + mBody.Year);
            logToConsoleAndFile("IMDb Rating: " + mBody.imdbRating);
            logToConsoleAndFile(mBody.Ratings[1].Source + " Rating- " + mBody.Ratings[1].Value);
            logToConsoleAndFile("Country where movie was produced: " + mBody.Country);
            logToConsoleAndFile("Movie Languages: " + mBody.Language);
            logToConsoleAndFile("Plot: " + mBody.Plot);
            logToConsoleAndFile("Actors: " + mBody.Actors);
            logToConsoleAndFile("");
        }
    });

}


else if (command === "do-what-it-says") {

    // We will read the existing bank file
    fs.readFile("random.txt", "utf8", function(err, data) {
        if (err) {
            return console.log(err);
        }
        var dataArr = data.split(",");
        //Name of song pulled 
        var songName = dataArr[1];
        // second way to get info from API//
        spotify.search({ type: 'track', query: songName, limit: 1, }, function(err, data) {

            if (err) {
                return console.log('Error occured' + err);
            }
            // console.log(JSON.stringify(data, null, 1));
            var string = JSON.stringify
            //trying to parse object and get info i want
            var spotData = (string(data.tracks.items[0].album));
            // console.log(spotData);
            // Artist Name(s)
            logToConsoleAndFile("Artist Name: " + string(data.tracks.items[0].album.artists[0].name, null, 4));
            //Song Name from Spotify API
            logToConsoleAndFile("Song Name: " + string(data.tracks.items[0].name));

            // A preview link of the song from Spotify, if there is no preview available let user know
            if (data.hasOwnProperty('preview_url')) {
                logToConsoleAndFile("Preview Link: " + string(data.tracks.items[0].preview_url, null, 2));
            }
            else {
                logToConsoleAndFile("There is no Preview URL available from Spotify.");
            }

            // // The Album's name
            logToConsoleAndFile("Album Name: " + string(data.tracks.items[0].album.name, null, 4));

            logToConsoleAndFile('');

        });

    });
}
