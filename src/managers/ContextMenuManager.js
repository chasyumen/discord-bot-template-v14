import { Collection, PermissionsBitField, ApplicationCommand, ApplicationCommandType } from "discord.js";
import { readdir } from "fs";
import { join, resolve } from "path";
import { eachSeries } from "async";
import MessageContextMenu from "../structures/MessageContextMenu.js";
import UserContextMenu from "../structures/UserContextMenu.js";
import getDir from "../utils/getDir.js";
import { ContextMenuCommandBuilder } from "@discordjs/builders";
import generateDescriptionArray from "../utils/generateDescriptionArray.js";
import registerCommandOptions from "../utils/registerCommandOptions.js";

export default class ContextMenuManager extends Collection {
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
        const cmds = await getDir(`./bot/contextMenus`);//await new Promise(resolve => readdir("./bot/commands",(error, result) => resolve(result)));
        // console.log(cmds.map(cmd=>cmd.split("./bot/commands/")[1]));
        var filtered = cmds.filter(x => x.endsWith('.js') || x.endsWith('.cjs'));
        await eachSeries(filtered, async file => {
            let command_raw = await import("../../" + file);//join("../../bot/commands", file)
            if (command_raw.default) command_raw = command_raw.default;
            if (command_raw.commandType == "2") {
                var command = new UserContextMenu(command_raw, this.client);
                this.set(command.name, command);
            } else if (command_raw.commandType == "3") {
                var command = new MessageContextMenu(command_raw, this.client);
                this.set(command.name, command);
            }
        });
        return this.toJSON();
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
            if (cmd.type !== ApplicationCommandType.Message || cmd.type !== ApplicationCommandType.User) return;
            var command = client.contextMenus.toJSON().find(x => x.name == cmd.name);
            // console.log(command);
            if (!command) {
                console.log("contextMenuDelete");
                await cmd.delete();
            } else if (command.hide === true) {
                await cmd.delete();
            }
            return true;
        });
        await eachSeries(this.client.contextMenus.toJSON(), async (cmd, index) => {
            await new Promise(async (resolve, reject) => {
                if (cmd.hide == true) resolve(false);
                var command = client.application.commands.cache.find(x => x.name == cmd.name);
                // let descriptionArray = generateDescriptionArray(cmd.descriptions);
                let commandBuilder = new ContextMenuCommandBuilder();
                commandBuilder
                    .setName(cmd.name)
                    .setType(Number(cmd.commandType));
                    // .setDescription(cmd.descriptions[config.defaultLanguage]);
                    //
                // descriptionArray.forEach(loc => {
                //     commandBuilder.setDescriptionLocalization(loc.locale, loc.string);
                // });

                // console.log(commandBuilder);
                // console.log(cmd.subCommands);

                // commandBuilder = registerCommandOptions(commandBuilder, cmd.slashOptions);

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
                // console.log(commandBuilder)
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