import { Collection, PermissionsBitField, ApplicationCommand, ApplicationCommandType } from "discord.js";
import { readdir } from "fs";
import { join, resolve } from "path";
import { eachSeries } from "async";
import Command from "../structures/Command.js";
import SubCommand from "../structures/SubCommand.js";
import SubCommandGroup from "../structures/SubCommandGroup.js";
import getDir from "../utils/getDir.js";
import { SlashCommandBuilder, SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder } from "@discordjs/builders";
import generateDescriptionArray from "../utils/generateDescriptionArray.js";
import registerCommandOptions from "../utils/registerCommandOptions.js";

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
        var filtered = cmds.filter(x => x.endsWith('.js') || x.endsWith('.cjs'));
        await eachSeries(filtered, async file => {
            let command_raw = await import("../../" + file);//join("../../bot/commands", file)
            if (command_raw.default) command_raw = command_raw.default;
            if (command_raw.commandType == "1") {
                var command = new Command(command_raw, this.client);
                this.set(command.name, command);
                command.aliases.forEach((alias) => {
                    aliases.set(alias, command.name);
                });
            } else if (command_raw.commandType == "2") {
                var command = new SubCommand(command_raw, this.client);
                if (command.parentCommand) {
                    if (!subCommands[command.parentCommand]) {
                        subCommands[command.parentCommand] = [];
                    }
                    subCommands[command.parentCommand].push(command);
                }
            } else if (command_raw.commandType == "3") {
                var command = new SubCommandGroup(command_raw, this.client);
                if (command.parentCommand) {
                    if (!subCommandGroups[command.parentCommand]) {
                        subCommandGroups[command.parentCommand] = [];
                    }
                    subCommandGroups[command.parentCommand].push(command);
                }
                // var command = new SubCommand(command_raw); 
            } else {
                
            }
        });
        Object.keys(subCommandGroups).forEach((key) => {
            var array = subCommandGroups[key];
            // console.log(key)
            array.forEach((cmdGroup) => {
                // console.log(cmdGroup);
                if (cmdGroup.parentCommand)  {
                    var command = manager.get(cmdGroup.parentCommand);
                }
                command.subCommands.set(cmdGroup.name, cmdGroup);
            });
        });
        // console.log(subCommandGroups)
        Object.keys(subCommands).forEach((key) => {
            var array = subCommands[key];
            // console.log(key)
            array.forEach((cmd) => {
                // console.log(cmd);
                if (cmd.parentGroup) {
                    var command = manager.get(cmd.parentCommand).subCommands.get(cmd.parentGroup);//cmd.subCommands.get(cmd.parentGroup);
                } else {
                    var command = manager.get(cmd.parentCommand);
                }
                command.subCommands.set(cmd.name, cmd);
            });
        });
        // console.log(this.toJSON());
        return this.toJSON;
    }

    /**
     * 
     * スラッシュコマンドを登録
     * @returns {false}
     */

    async slashReg() {
        var client = this.client;
        // console.log(this.client.application.commands.cache.toJSON());
        await eachSeries(this.client.application.commands.cache.toJSON(), async (cmd) => {
            if (cmd.type !== ApplicationCommandType.ChatInput) return;
            if (cmd.guildId) return await cmd.delete();
            var command = client.commands.toJSON().find(x => x.name == cmd.name);
            // console.log(command.guildCommand);
            if (!command) {
                console.log("slashDelete");
                await cmd.delete();
            } else if (command.hide === true) {
                await cmd.delete();
            } else if (command.guildCommand == true) {
                await cmd.delete();
            }
            return true;
        });
        await eachSeries(this.client.commands.toJSON(), async (cmd, index) => {
            await new Promise(async (resolve, reject) => {
                if (cmd.hide == true) return resolve(false);
                if (cmd.guildCommand) return resolve(false);
                var command = client.application.commands.cache.find(x => x.name == cmd.name);
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
                let descriptionArray = generateDescriptionArray(cmd.descriptions);
                let commandBuilder = new SlashCommandBuilder();
                commandBuilder
                    .setName(cmd.name)
                    .setDescription(cmd.descriptions[config.defaultLanguage]);
                    //
                descriptionArray.forEach(loc => {
                    commandBuilder.setDescriptionLocalization(loc.locale, loc.string);
                });

                // console.log(commandBuilder);
                // console.log(cmd.subCommands);
                cmd.subCommands.forEach((subCommand) => {
                    if (subCommand.commandType == "2") {
                        var subCommandBuilder = new SlashCommandSubcommandBuilder();
                        // console.log(subCommand)
                        let subCommandDescriptionArray = generateDescriptionArray(cmd.descriptions);
                        subCommandBuilder
                            .setName(subCommand.name)
                            .setDescription(subCommand.descriptions[config.defaultLanguage]);
                        subCommandDescriptionArray.forEach(loc => {
                            subCommandBuilder.setDescriptionLocalization(loc.locale, loc.string);
                        });
                        subCommandBuilder = registerCommandOptions(subCommandBuilder, subCommand.slashOptions);
                        commandBuilder.addSubcommand(subCommandBuilder);
                    } else if (subCommand.commandType == "3") {
                        var subCommandGroupBuilder = new SlashCommandSubcommandGroupBuilder();
                        let subCommandGroupDescriptionArray = generateDescriptionArray(cmd.descriptions);
                        subCommandGroupBuilder
                            .setName(subCommand.name)
                            .setDescription(subCommand.descriptions[config.defaultLanguage]);
                        subCommandGroupDescriptionArray.forEach(loc => {
                            subCommandGroupBuilder.setDescriptionLocalization(loc.locale, loc.string);
                        });
                        subCommand.subCommands.forEach((subCommand2) => {
                            if (subCommand2.commandType == "2") {
                                var subCommandBuilder = new SlashCommandSubcommandBuilder();
                                // console.log(subCommand)
                                let subCommandDescriptionArray = generateDescriptionArray(cmd.descriptions);
                                subCommandBuilder
                                    .setName(subCommand2.name)
                                    .setDescription(subCommand2.descriptions[config.defaultLanguage]);
                                subCommandDescriptionArray.forEach(loc => {
                                    subCommandBuilder.setDescriptionLocalization(loc.locale, loc.string);
                                });
                                subCommandBuilder = registerCommandOptions(subCommandBuilder, subCommand2.slashOptions);
                                subCommandGroupBuilder.addSubcommand(subCommandBuilder);
                            }
                        });
                        commandBuilder.addSubcommandGroup(subCommandGroupBuilder);
                    }
                });

                commandBuilder = registerCommandOptions(commandBuilder, cmd.slashOptions);

                //DMでの利用OK or NG
                commandBuilder.setDMPermission(cmd.dm);

                //デフォルト権限set up
                if (typeof cmd.permissions.userNeeded == "object") {
                    var finalperm = 0n;
                    cmd.permissions.userNeeded.forEach(perm => {
                        return finalperm = finalperm+perm;
                    });
                } else {
                    var finalperm = cmd.permissions.userNeeded;
                }
                if (finalperm == 0) {
                    var finalperm = null;
                }
                commandBuilder.setDefaultMemberPermissions(finalperm);
                if (command) {
                    await client.application.commands.edit(command, commandBuilder);
                } else {
                    await client.application.commands.create(commandBuilder);
                }
                return setTimeout(() => {resolve(true)}, 2000)
            });
            return;
        });
        return false;
    }
}