import { Collection } from "discord.js";
import CommandExecute from "./CommandExecute.js";

export default class SubCommandGroup {
    constructor(cmd) {
        this.name = cmd.name;
        this.descriptions = cmd.descriptions;
        // this.category = cmd.category || "unknown";
        this.commandType = cmd.commandType || "3";
        this.parentCommand = cmd.parentCommand;
        this.parentGroup = null;
        this.subCommands = new Collection();
        // this.disableSlash = cmd.disableSlash;
        this.hide = typeof cmd.hide == "boolean" ? cmd.hide : false;
        // this.isNsfw = typeof cmd.isNsfw == "boolean" ? cmd.isNsfw : false;
        // this.aliases = cmd.aliases || []; 
        this.exec = cmd.exec;
        this.slashOptions = cmd.slashOptions || {};
        this.permissions = cmd.permissions;
    }

    createDescriptionRow(lang) {
        return "";
    }

    executor(interaction, info) {
        return new Error("executing subcommand group is invalid"); //new CommandExecute(this, interaction, info);
    }
}