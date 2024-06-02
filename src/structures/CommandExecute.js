import { Message } from "discord.js";

export default class CommandExecute {
    constructor(command, raw, info) {
        this.command = command;
        this.info = info;
        this.raw = raw;
        this.isSlash = info.isSlash;
        this.replyMessage = null;

        this.guild = this.raw.guild || null;
        this.author = (this.isSlash ? raw.user : raw.author);
        this.channel = this.raw.channel || null;
        this.member = this.raw.member;
        this.options = this.raw.options;
        this.replied = false;
    }

    // async send(...data) {
    //     if (this.replied) {
    //         if (!this.isSlash) {
    //             var msg = await this.raw.channel.send(...data);
    //             return msg;
    //         } else {
    //             // if (this.raw.deferred) return this.raw.editReply(...reply);
    //             return await this.raw.channel.send(...data);
    //         }
    //     } else {
    //         return await this.reply(...data);
    //     }
    // }

    async reply(...reply) {
        this.replied = true;
        // if (!this.isSlash) {
        //     var msg = await this.raw.reply(...reply);
        //     this.replyMessage = msg;
        //     return msg;
        // } else {
            if (this.raw.replied) return false;
            if (this.raw.deferred) return this.raw.editReply(...reply);
            return await this.raw.reply(...reply);
        // }
    }

    async deleteReply(...option) {
        this.replied = true;
        // if (!this.isSlash) {
        //     // var typing = await this.raw.channel.sendTyping(...option);
        //     return null;
        // } else {
            if (this.raw.replied) return false;
            return await this.raw.deleteReply(...option);
        // }
    }

    async deferReply(...option) {
        this.replied = true;
        // if (!this.isSlash) {
        //     var typing = await this.raw.channel.sendTyping(...option);
        //     return typing;
        // } else {
            if (this.raw.replied) return false;
            return await this.raw.deferReply(...option);
        // }
    }

    // async editReply(...option) {
    //     if (!this.isSlash) {
    //         if (!this.replyMessage) return false;
    //         var edit = await this.replyMessage.edit(...option);
    //         return edit;
    //     } else {
    //         if (!this.raw.replied) return false;
    //         return await this.raw.editReply(...option);
    //     }
    // }

    // getFirstOption() {
    //     if (!this.isSlash) {
    //         return this.info.option;
    //     } else {
    //         return this.raw.options.data.filter(x => x.type == "STRING").length !== 0 ? this.raw.options.data.filter(x => x.type == "STRING")[0].value : null;
    //     }
    // }

    async exec() {
        // await this.deferReply();
        var language = this.info.language;
        var permission = await this.author.getPermissions();
        // console.log(permission);
        if (permission.has(this.command.permissions.bUser)) {
            return await this.command.exec(this, this.raw);
        } else {
            return await this.reply({ content: client.locale.getString("errors.permissions.user.botPermission", language), ephemeral: true });
        }
    }
}