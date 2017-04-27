'use strict';
const RtmClient = require('@slack/client').RtmClient;
const CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;
const BOT_ID = 'U4MMQGLBD';
let rtm;
let nlp;

function handleOnAuthenticated(rtmStartData) {
  console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}`);
}

function addAuthenticatedHandler(rtm, handler, nlpClient) {
  rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, handler);
}

function handleOnMessage(message) {
  nlp.ask(message.text, (err, res) => {
    if(err) {
      console.log(err);
      return;
    }

    if (!res.intent) {
      return rtm.sendMessage("Sorry, I don't understand", message.channel);
    } else if (res.intent[0].value == 'time' && res.location) {
      return rtm.sendMessage(`i don't know the time sheeet`, message.channel);
    }

    if (message.user !== BOT_ID) {
      rtm.sendMessage('Sorry', message.channel, function messageSent() {
      });
    }
  });

}

module.exports.init = function slackClient(token, logLevel, nlpClient) {
  rtm = new RtmClient(token, {logLevel: logLevel});
  nlp = nlpClient;
  addAuthenticatedHandler(rtm, handleOnAuthenticated);
  rtm.on(RTM_EVENTS.MESSAGE, handleOnMessage);
  return rtm;
}

module.exports.addAuthenticatedHandler = addAuthenticatedHandler;
