import { Collection, PermissionsBitField } from "discord.js";
import { readdir } from "fs";
import { join } from "path";
import Command from "../structures/Command.js";
import getDir from "../utils/getDir.js";

export default class CommandManager extends Collection {
    constructor(client) {
        super();
        this.client = client;
        this.aliases = new Collection();
    }

    async loadAll() {
        var aliases = this.aliases;
        const cmds = await getDir(`./bot/commands`);//await new Promise(resolve => readdir("./bot/commands",(error, result) => resolve(result)));
        return cmds.filter(x => x.endsWith('.js')).forEach(async file => {
            let command_raw = await import("../../"+file);//join("../../bot/commands", file)
            let command = new Command(command_raw);
            this.set(command.name, command);
            command.aliases.forEach((alias) => {
                aliases.set(alias, command.name);
            });
        });
    }
}