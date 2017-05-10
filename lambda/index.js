var Alexa = require('alexa-sdk');

exports.handler = function(event, context, callback){
  var alexa = Alexa.handler(event, context);
  alexa.appId = 'amzn1.ask.skill.6b4b6dd3-9c5f-4812-a90a-bd1e465c84e9';
  alexa.registerHandlers(handlers);
  alexa.execute();
};

var handlers = {

  'LaunchRequest': function () {
    this.emit(':ask','Hello world!  Say the name of an artist.', 'Try saying the name of an artist');
  },

  'ArtistName': function() {
    var artistName = this.event.request.intent.slots.artist.value;
    this.emit(':ask','You said ' + artistName);
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