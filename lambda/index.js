var Alexa = require('alexa-sdk');
var AWS = require("aws-sdk");

exports.handler = function(event, context, callback){
  var alexa = Alexa.handler(event, context);
  // alexa.APP_ID = 'amzn1.ask.skill.458a4a08-6764-4e37-9363-6d054ac4e645';
  alexa.registerHandlers(handlers);
  alexa.execute();
};

var handlers = {

  'LaunchRequest': function () {
    this.emit(':ask','Say the name of an artist.', 'Try saying the name of an artist');
  },

  'ArtistName': function() {
    var artistName = this.event.request.intent.slots.artist.value;
    // require the request package
    var request = require('request');

    // set up the variables used for the db request
    var docClient = new AWS.DynamoDB.DocumentClient();
    var fact = undefined;
    var table = "MusicFacts";
    var factUsage = undefined;

    // generate a random number between min and max to use for query
    var min = 1;
    var max = 5;
    var id = Math.floor(Math.random() * (max - min + 1)) + min;

    // set up parameters for db query
    var params = {
        TableName: table,
        Key:{
            "id": id
        }
    };

    // execute the query against the DB
    docClient.get(params, (err, dbData) => {
        if (err) {
            console.error("Unable to query DB. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            fact = dbData.Item.fact;
            factUsage = dbData.Item.usageCount || 0;
            factUsage = factUsage + 1;

            // Update counter for the fact used
            params = {
                TableName:table,
                Key:{
                    "id": id
                },
                UpdateExpression: "set usageCount = :newCount",
                ExpressionAttributeValues:{
                    ":newCount": factUsage
                },
                ReturnValues:"UPDATED_NEW"
            };

            // execute the update statement. Note this is done in the same callback so the
            //  asynchronous calls don't get made out of order
            console.log("Updating the fact counter for id="+ id +"...");
            docClient.update(params, (err, dbData) => {
                if (err) {
                    console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
                } else {
                    console.log("UpdateItem succeeded:", JSON.stringify(dbData, null, 2));
                }
            });
        }
    });

    // set up variables used in the API request
    var artist = artistName;
    var api_key = '81e78ef30ab28fd04ac12e9041703ef3'; 
    artist = encodeURIComponent(artist);
    
    // generate the url
    var endpoint = 'http://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist='+
                      artist +'&api_key='+api_key+'&format=json';

    // we're issuing a GET request here, so we use the get method in the request object
    request.get(endpoint, (error, response, body) => {
        if(response.statusCode !== 200) {
            this.emit(':ask','There was an error processing your request.');
        } else {
            // parse the data into a JSON object
            data = JSON.parse(body);
            // notice the two different ways we can access JSON objects below:
            //artist = data["topalbums"]["@attr"]["artist"];
            topalbums = data.topalbums.album;

            // let's sort by playcount in descending order so it makes a little more sense
            topalbums.sort(function(a, b) {
                return parseFloat(b.playcount) - parseFloat(a.playcount);
            });
            
            this.emit(':ask','The number one album for ' + artistName + ' based on last <say-as interpret-as="spell-out">fm</say-as> play count is ' + topalbums[0].name + '. Did you know ' + fact);
        }
    });
  },

  'AMAZON.StopIntent': function () {
    // State Automatically Saved with :tell
    this.emit(':tell', `Goodbye.`);
  },
  'AMAZON.CancelIntent': function () {
    // State Automatically Saved with :tell
    this.emit(':tell', `Goodbye.`);
  },
  'SessionEndedRequest': function () {
    // Force State Save When User Times Out
    this.emit(':saveState', true);
  },

  'AMAZON.HelpIntent' : function () {
    this.emit(':ask', `You can tell me the name of a musical artist and I will say it back to you.  Who would you like me to find?`,  `Who would you like me to find?`);
  },
  'Unhandled' : function () {
    this.emit(':ask', `You can tell me the name of a musical artist and I will say it back to you.  Who would you like me to find?`,  `Who would you like me to find?`);
  }

};