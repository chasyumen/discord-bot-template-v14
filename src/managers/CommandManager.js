const { Collection, PermissionsBitField } = require("discord.js");
const { readdir } = require("fs");
const { join } = require("path");
const Command = require("../structures/Command.js");
const getDir = require("../utils/getDir.js");

module.exports = class CommandManager extends Collection {
    constructor(client) {
        super();
        this.client = client;
        this.aliases = new Collection();
    }

    async loadAll() {
        var aliases = this.aliases;
        const cmds = await getDir(`./bot/commands`);//await new Promise(resolve => readdir("./bot/commands",(error, result) => resolve(result)));
        return cmds.filter(x => x.endsWith('.js')).forEach(file => {
            let command_raw = require(join("../../", file));//join("../../bot/commands", file)
            let command = new Command(command_raw);
            this.set(command.name, command);
            command.aliases.forEach((alias) => {
                aliases.set(alias, command.name);
            });
        });
    }

    
}