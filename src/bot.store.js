const { Store } = require('data-store');

const ROOT = 'root'
const SUBSCRIBERS = 'subscribers'

class BotStore extends Store {
    constructor() {
        process.chdir(__dirname + '/../')
        super('bot.subscribers.data', { home: process.cwd() });
    }

    get root() {
        return this.get(ROOT, null)
    }

    get subscribers() {
        return this.get(SUBSCRIBERS, [])
    }

    setSubscriber(subscriber) {
        if (!this.root) {
            this.set(ROOT, subscriber)
        }
        this.union(SUBSCRIBERS, subscriber)
    }
}

module.exports = new BotStore()

