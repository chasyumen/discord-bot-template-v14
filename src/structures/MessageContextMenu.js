import { Collection } from "discord.js";
import ContextMenuExecute from "./ContextMenuExecute.js";

export default class MessageContextMenu {
    constructor(cmd, client) {
        this.name = cmd.name;
        this.descriptions = typeof cmd.descriptions == "object" ? 
            cmd.descriptions : 
            (() => {var json = {}; json[client.config.defaultLanguage] = "No description"; return json;});
        // this.category = cmd.category || "unknown";
        this.commandType = cmd.commandType || "1";
        this.dm = typeof cmd.dm == "boolean" ? cmd.dm : false;
        // this.disableSlash = cmd.disableSlash;
        this.hide = typeof cmd.hide == "boolean" ? cmd.hide : false;
        this.exec = cmd.exec;
        // this.slashOptions = cmd.slashOptions || [];
        this.permissions = cmd.permissions || {};
    }

    createDescriptionRow(lang) {
        return {raw: `/${this.name} | ${this.descriptions[lang]}`, formatted: `\`/${this.name}\` | ${this.descriptions[lang]}`}
    }

    executor(interaction, info) {
        return new ContextMenuExecute(this, interaction, info);
    }
}