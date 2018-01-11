/*
TODO

*/

const { Bot } = require('@dlghq/dialog-bot-sdk');
// const path = require('path');
const config = require('./config');
const API = require('./API');

const bot = new Bot({
  endpoints: ['wss://ws1.coopintl.com', 'wss://ws2.coopintl.com'],
  phone: '755512345',
  code: '5555',
});

// const state = {};

bot.onMessage(async (peer, message) => {
  API.DefineNewUser(peer);
  if (config.users[peer.id].startedButton && peer.type !== 'group' && API.IfPeerAdmin(peer)) {
    API.greetings(bot, peer);
  }
  if (config.users[peer.id].verification) API.AskQuestions(bot, peer, message);
  if (config.users[peer.id].edit) API.EditInfo(bot, peer, message);
  if (
    config.users[peer.id].verified === true &&
    (message.content.text.toLowerCase() === 'исправить' ||
      message.content.text.toLowerCase() === 'bcghfdbnm' ||
      message.content.text.toLowerCase() === 'и')
  ) {
    API.checking(bot, peer);
  }
});

bot.onInteractiveEvent(async (event) => {
  if (event.value === 'start') {
    API.AskQuestions(bot, event.peer);
    config.users[String(event.peer.id)].verification = true;
  }
  if (
    event.value === 'fio' ||
    event.value === 'birth' ||
    event.value === 'region' ||
    event.value === 'vacation' ||
    event.value === 'status' ||
    event.value === 'spehre'
  ) {
    API.SelectEditInfo(event, bot);
  }
});
