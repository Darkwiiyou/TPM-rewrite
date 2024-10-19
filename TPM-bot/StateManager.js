const { debug } = require('../logger.js');

let queue = [];

class StateManager {

    constructor(bot) {
        this.state = 'moving';
        this.lastaction = Date.now();
        this.bot = bot;
    }

    set(newState) {
        debug(`Set state to ${newState}`);
        this.state = newState;
    }

    get() {
        return this.state;
    }

    setAction(time = Date.now()) {
        this.lastaction = time;
    }

    getTime() {
        return this.lastaction;
    }

    getHighest() {
        return queue[0] || null;
    }

    queueAdd(action, state, priority) {
        queue.push({ action: action, state: state, priority: priority });
        queue.sort((a, b) => b.priority - a.priority);
        debug(JSON.stringify(queue));
    }

    queueRemove(){
        queue.shift();
    }

}

module.exports = StateManager;