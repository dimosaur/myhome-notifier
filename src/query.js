const Axios = require('axios')
const Store = require('./query.store')
const BotStore = require('./bot.store')
const { sendMessage, notify } = require('./notifier')

const axios = Axios.create({
    baseURL: 'https://www.myhome.ge/ka',
})
const filters = require('./query.filter.params.json')

const mapFloor = (floor) => ({
    id: Number(floor.product_id),
    area: Number(floor.area_size_value),
    price: Number(floor.price),
    m2price: Math.round(Number(floor.price) / Number(floor.area_size_value)),
    date: (new Date(floor.order_date)).toLocaleDateString('ka-GE', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
    }),
    rooms: Number(floor.rooms),
    bedrooms: Number(floor.bedrooms),
    name: JSON.parse(floor.name_json).ka,
    address: JSON.parse(floor.pathway_json).ka,
    comment: floor.comment,
    isVip: Boolean(Number(floor.vip)),
    url: `https://www.myhome.ge/ka/pr/${floor.product_id}`,
})

let skippedVips = 0
const parse = async (page = 1) => {
    console.log('------STARTED-------', 'page', page)
    const products = await axios.get('/s', { params: { ...filters, Page: page } }).then(({ data }) => {
        const { Data = {} } = data
        const { Prs: all = [], Cnt: cnt } = Data
        return all.map(mapFloor)
    })

    if (products.length === 0) {
        return
    }

    for (let i = 0; i < products.length; i++) {
        const product = products[i]
        if (Store.check(product.id)) {
            if (product.isVip) {
                skippedVips++
                continue
            }
            console.log('------STOPPED-------', 'page', page, 'index', i, 'skippedVips', skippedVips)
            return sendMessage(BotStore.root, `Stopped at page ${page} and item index ${i} skipped ${skippedVips}`)
        }

        notify(product)
        Store.setSentProduct(product.id)
    }

    parse(page + 1)
}
parse()
