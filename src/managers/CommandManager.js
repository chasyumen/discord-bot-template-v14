import { Collection, PermissionsBitField, ApplicationCommand } from "discord.js";
import { readdir } from "fs";
import { join, resolve } from "path";
import { eachSeries } from "async";
import Command from "../structures/Command.js";
import SubCommand from "../structures/SubCommand.js";
import getDir from "../utils/getDir.js";
import { SlashCommandBuilder, SlashCommandSubcommandBuilder } from "@discordjs/builders";

export default class CommandManager extends Collection {
    constructor(client) {
        super();
        this.client = client;
        this.aliases = new Collection();
    }

    /**
     * コマンドを読み込みます
     * ファイル名は自由です
     * @returns {null};
     */

    async loadAll() {
        var manager = this;
        var aliases = manager.aliases;
        const cmds = await getDir(`./bot/commands`);//await new Promise(resolve => readdir("./bot/commands",(error, result) => resolve(result)));
        // console.log(cmds.map(cmd=>cmd.split("./bot/commands/")[1]));
        var subCommands = {};
        var subCommandGroups = {};
        var filtered = cmds.filter(x => x.endsWith('.js'));
        await eachSeries(filtered, async file => {
            let command_raw = await import("../../" + file);//join("../../bot/commands", file)
            if (command_raw.commandType == "1") {
                var command = new Command(command_raw);
                this.set(command.name, command);
                command.aliases.forEach((alias) => {
                    aliases.set(alias, command.name);
                });
            } else if (command_raw.commandType == "2") {
                var command = new SubCommand(command_raw);
                if (command.parentCommand) {
                    if (!subCommands[command.parentCommand]) {
                        subCommands[command.parentCommand] = [];
                    }
                    subCommands[command.parentCommand].push(command);
                }
            } else if (command_raw.commandType == "3") {
                // var command = new SubCommand(command_raw);
            } else {
                
            }
        });
        Object.keys(subCommands).forEach((key) => {
            var array = subCommands[key];
            // console.log(key)
            array.forEach((cmd) => {
                // console.log(cmd);
                if (cmd.parentGroup) {
                    var command = command.subCommands.get(cmd.parentGroup);
                } else {
                    var command = manager.get(cmd.parentCommand);
                }
                command.subCommands.set(cmd.name, cmd);
            });
        });
        // console.log(this.toJSON());
        return;
    }

    async slashReg() {
        // console.log(this.client.application.commands.cache.toJSON());
        await eachSeries(this.client.application.commands.cache.toJSON(), async (cmd) => {
            return;
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
            await new Promise(async (resolve, reject) => {
                var command = this.client.application.commands.cache.find(x => x.name == cmd.name);
                // console.log(cmd.name);
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
                commandBuild
                    .setName(cmd.name)
                    .setDescription(cmd.descriptions[config.defaultLanguage]);

                // console.log(commandBuild);
                // console.log(cmd.subCommands);
                cmd.subCommands.forEach((subCommand) => {
                    if (subCommand.commandType == "2") {
                        var subCommandBuilder = new SlashCommandSubcommandBuilder();
                        // console.log(subCommand)
                        subCommandBuilder
                            .setName(subCommand.name)
                            .setDescription(subCommand.descriptions[config.defaultLanguage]);
                        commandBuild.addSubcommand(subCommandBuilder);
                    }
                });
                // commandBuild.addSubcommand()
                //option equals function
                

                // if (command) {
                //     if (ApplicationCommand.optionsEqual(command.options, commandBuild.options)) {
                //         console.log(cmd.name, "Skipped");
                //         return resolve(false);
                //     }
                // }

                // console.log(command.options, commandBuild.options)

                // console.log(cmd.name, "Proceed")

                // if (cmd.disableSlash) {
                //     set = false;
                // }
                // console.log(command, "\n", set, "\n", cmd)

                // var commandData = cmd.slashOptions;
                // commandData["name"] = cmd.name;
                // commandData["description"] = `${descriptionParsed}`;
                if (command) {
                    await this.client.application.commands.edit(command, commandBuild);
                } else {
                    await this.client.application.commands.create(commandBuild);
                }
                return setTimeout(() => {resolve(true)}, 100)
            });
        });
    }
}