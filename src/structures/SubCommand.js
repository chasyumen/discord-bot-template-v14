import CommandExecute from "./CommandExecute.js";

export default class SubCommand {
    constructor(cmd) {
        this.name = cmd.name;
        this.descriptions = cmd.descriptions;
        // this.category = cmd.category || "unknown";
        this.commandType = cmd.commandType || "2";
        this.parentCommand = cmd.parentCommand;
        this.parentGroup = cmd.parentGroup;
        this.subCommands = null;
        // this.disableSlash = cmd.disableSlash;
        // this.hide = typeof cmd.hide == "boolean" ? cmd.hide : false;
        // this.isNsfw = typeof cmd.isNsfw == "boolean" ? cmd.isNsfw : false;
        // this.aliases = cmd.aliases || []; 
        this.exec = cmd.exec;
        this.slashOptions = cmd.slashOptions || [];
        this.permissions = cmd.permissions;
    }

    createDescriptionRow(lang) {
        return {raw: `/${this.parentCommand} ${this.parentGroup ? this.parentGroup+" " : ""}${this.name} | ${this.descriptions[lang]}`, formatted: `\`/${this.parentCommand} ${this.parentGroup ? this.parentGroup+" " : ""}${this.name}\` | ${this.descriptions[lang]}`}
    }

    executor(interaction, info) {
        return new CommandExecute(this, interaction, info);
    }
}