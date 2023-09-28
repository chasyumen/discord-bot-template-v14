const { Collection } = require("discord.js");
const { readdir } = require("fs");
const { join } = require("path");

module.exports = class EventManager extends Collection {
    constructor(client) {
        super();
        this.client = client;
    }

    async loadAll() {
        const events = await new Promise(resolve => readdir("./bot/events",(error, result) => resolve(result)));
        return events.filter(x => x.endsWith('.js')).forEach(file => {
            let event = require(join("../../bot/events", file));
            this.set(event.name, event);
            this.client.on(event.event, async function (...a) {
                return await event.run(...a);
            });
        });
    }
}