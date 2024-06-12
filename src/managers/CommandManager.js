import { Collection, PermissionsBitField, ApplicationCommand } from "discord.js";
import { readdir } from "fs";
import { join, resolve } from "path";
import { eachSeries } from "async";
import Command from "../structures/Command.js";
import getDir from "../utils/getDir.js";
import { SlashCommandBuilder } from "@discordjs/builders";

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
            let command_raw = await import("../../" + file);//join("../../bot/commands", file)
            let command = new Command(command_raw);
            this.set(command.name, command);
            command.aliases.forEach((alias) => {
                aliases.set(alias, command.name);
            });
        });
    }

    async slashReg() {
        // console.log(this.client.application.commands.cache.toJSON());
        await eachSeries(this.client.application.commands.cache.toJSON(), async (cmd) => {
            if (cmd.type !== 1) return;
            var command = this.client.commands.toJSON().find(x => x.name == cmd.name);
            // console.log(command);
            if (!command) {
                console.log("slashDelete");
                await cmd.delete();
            } else if (command.disableSlash === true) {
                await cmd.delete();
            }
            return true;
        });
        await eachSeries(this.client.commands.toJSON(), async (cmd, index) => {
            await new Promise((resolve, reject) => {
                var set = false;
                var command = this.client.application.commands.cache.find(x => x.name == cmd.name);
                // if (typeof command == "object") {
                //     var descriptionParsed = `${cmd.descriptions.en_US} / ${cmd.descriptions.ja}`;
                //     if (descriptionParsed !== command.description) {
                //         set = true;
                //     } else if (cmd.slashOptions.options) {
                //         if (cmd.slashOptions.options.length !== command.options.length) {
                //             set = true;
                //         }
                //     } else if (!cmd.slashOptions.options && command.options.length >= 1) {
                //         set = true;
                //     }
                // } else {
                //     set = true;
                // }
                let commandBuild = new SlashCommandBuilder();
                if (!command) {
                }


                commandBuild.addSubcommand(subcommand =>
                    subcommand
                        .setName('server')
                        .setDescription('Info about the server'));

                console.log(commandBuild);

                //option equals function

                // if (cmd.disableSlash) {
                //     set = false;
                // }
                // console.log(command, "\n", set, "\n", cmd)

                // var commandData = cmd.slashOptions;
                // commandData["name"] = cmd.name;
                // commandData["description"] = `${descriptionParsed}`;
                // if (set) {
                //     if (command) {
                //         await command.delete();
                //     }
                //     await this.client.application.commands.create(commandData);
                // }
                return setTimeout(resolve, 100)
            });
        });
    }
}