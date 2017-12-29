/*
TODO

*/

const { Bot } = require('@dlghq/dialog-bot-sdk');
const path = require('path');

const bot = new Bot({
  endpoints: ['wss://ws1.dlg.im'],
  phone: '7555123321',
  code: '5555',
});

const state = {};

const users = {};

bot.onMessage(async (peer, message) => {});

bot.onInteractiveEvent(async event => {});
