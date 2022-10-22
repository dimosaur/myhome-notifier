const TelegramBot = require('node-telegram-bot-api');
const Store = require('./bot.store')

const token = require('../bot.config.data.json').token;

const bot = new TelegramBot(token, { polling: true });

bot.onText(/^\/start$/, (msg, match) => {
    const chatId = msg.chat.id;
    Store.setSubscriber(chatId)
    return bot.sendMessage(chatId, 'welcome');
});

