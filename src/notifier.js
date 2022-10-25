const Axios = require('axios')
const subscribers = require('./bot.store').subscribers

const token = require('../bot.config.data.json').token;
const axios = Axios.create({
    baseURL: `https://api.telegram.org/bot${token}`,
})

const sendMessage = (chat_id, text) => {
    return axios.get('/sendMessage', { params: { chat_id, text } })
}

const makeText = (product) => {
    return `${product.m2price}$ ${product.area}m2 ${product.price}$\r\n` +
        `${product.rooms} rooms, ${product.bedrooms} bedrooms\r\n` +
        `${product.date}\r\n` +
        `\r\n${product.comment}\r\n\r\n` +
        `${product.url}`
}

const notify = (product) => {
    const text = makeText(product)
    subscribers.forEach(subscriber => {
        return sendMessage(subscriber, text)
            .then(({ status }) => {
                console.log(subscriber, product.id, status)
            })
    })
}

module.exports = { sendMessage, notify }
