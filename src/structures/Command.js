const CommandExecute = require("./CommandExecute.js");

module.exports = class Command {
    constructor(cmd) {
        this.name = cmd.name;
        this.descriptions = cmd.descriptions;
        this.description_ja = cmd.descriptions.ja;
        this.category = cmd.category || "unknown";
        // this.disableSlash = cmd.disableSlash;
        this.hide = typeof cmd.hide == "boolean" ? cmd.hide : false;
        this.aliases = cmd.aliases || [];
        this.exec = cmd.exec;
        // this.slashOptions = cmd.slashOptions || {};
        this.permissions = cmd.permissions;
    }

    createDescriptionRow(lang) {
        return `${this.name} | ${this.descriptions[lang]}`
    }
}