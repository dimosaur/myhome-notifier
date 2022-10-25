const { Store } = require('data-store')

const SENT_PRODUCTS = 'sent_products'

class QueryStore extends Store {
    constructor() {
        process.chdir(__dirname + '/../')
        super('query.data', { home: process.cwd() })
    }

    check(product) {
        const products = this.get(SENT_PRODUCTS, [])
        return products.includes(product)
    }

    setSentProduct(product) {
        this.union(SENT_PRODUCTS, product)
    }
}

module.exports = new QueryStore()

