import { Collection } from "discord.js";
import CommandExecute from "./CommandExecute.js";

export default class Command {
    constructor(cmd, client) {
        this.name = cmd.name;
        this.descriptions = typeof cmd.descriptions == "object" ? 
            cmd.descriptions : 
            (() => {var json = {}; json[client.config.defaultLanguage] = "No description"; return json;});
        this.category = cmd.category || "unknown";
        this.commandType = cmd.commandType || "1";
        this.parentCommand = null;
        this.parentGroup = null;
        this.subCommands = new Collection();
        this.dm = typeof cmd.dm == "boolean" ? cmd.dm : false;
        // this.disableSlash = cmd.disableSlash;
        this.guildCommand = typeof cmd.guildCommand == "boolean" ? cmd.guildCommand : false;
        this.hide = typeof cmd.hide == "boolean" ? cmd.hide : false;
        this.isNsfw = typeof cmd.isNsfw == "boolean" ? cmd.isNsfw : false;
        this.aliases = cmd.aliases || [];
        this.exec = cmd.exec;
        this.slashOptions = cmd.slashOptions || [];
        this.permissions = cmd.permissions || {};
    }

    createDescriptionRow(lang) {
        return {raw: `/${this.name} | ${this.descriptions[lang]}`, formatted: `\`/${this.name}\` | ${this.descriptions[lang]}`}
    }

    executor(interaction, info) {
        if (this.subCommands.size == 0) {
            return new CommandExecute(this, interaction, info);
        } else {
            throw new Error("command with subcommands does not support running base command")
        }
    }
}