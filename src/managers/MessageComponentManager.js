import { Collection, PermissionsBitField } from "discord.js";
import { readdir } from "fs";
import { join } from "path";
import MessageComponent from "../structures/MessageComponent.js";
import getDir from "../utils/getDir.js";

export default class MessageComponentManager extends Collection {
    constructor(client) {
        super();
        this.client = client;
    }

    async loadAll() {
        var aliases = this.aliases;
        const cmds = await getDir(`./bot/messageComponents`);//await new Promise(resolve => readdir("./bot/commands",(error, result) => resolve(result)));
        return cmds.filter(x => x.endsWith('.js')).forEach(async file => {
            let messageComponent_raw = await import("../../"+file);//join("../../bot/commands", file)
            let messageComponent = new MessageComponent(messageComponent_raw);
            this.set(messageComponent.name, messageComponent);
        });
    }
}