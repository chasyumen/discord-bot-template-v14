import { Collection } from "discord.js";
import { readdir } from "fs";
import { join } from "path";

export default class EventManager extends Collection {
    constructor(client) {
        super();
        this.client = client;
    }

    async loadAll() {
        const events = await new Promise(resolve => readdir("./bot/events",(error, result) => resolve(result)));
        return events.filter(x => x.endsWith('.js')).forEach(async file => {
            let event = await import("../../bot/events/"+file);
            this.set(event.name, event);
            this.client.on(event.event, async function (...a) {
                return await event.run(...a);
            });
        });
    }
}