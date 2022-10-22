const { Store } = require('data-store')

const SENT_PRODUCTS = 'sent_products'

class QueryStore extends Store {
    constructor() {
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

