import CommandExecute from "./CommandExecute.js";

export default class Command {
    constructor(cmd) {
        this.name = cmd.name;
        this.descriptions = cmd.descriptions;
        this.category = cmd.category || "unknown";
        this.disableSlash = cmd.disableSlash;
        this.hide = typeof cmd.hide == "boolean" ? cmd.hide : false;
        this.aliases = cmd.aliases || [];
        this.exec = cmd.exec;
        this.slashOptions = cmd.slashOptions || {};
        this.permissions = cmd.permissions;
    }

    createDescriptionRow(lang) {
        return {raw: `${this.name} | ${this.descriptions[lang]}`, formatted: `\`${this.name}\` | ${this.descriptions[lang]}`}
    }

    executor(interaction, info) {
        return new CommandExecute(this, interaction, info);
    }
}