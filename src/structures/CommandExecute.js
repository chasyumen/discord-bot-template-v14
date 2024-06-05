import { Message } from "discord.js";
import ExtendedPermissionsBitField from "./ExtendedPermissionsBitField.js";

export default class CommandExecute {
    constructor(command, interaction, info) {
        this.command = command;
        this.info = info;
        this.interaction = interaction;
        this.isSlash = info.isSlash;
        this.replyMessage = null;

        this.guild = this.interaction.guild || null;
        this.author = (this.isSlash ? interaction.user : interaction.author);
        this.channel = this.interaction.channel || null;
        this.member = this.interaction.member;
        this.options = this.interaction.options;
        this.replied = false;
    }

    // async send(...data) {
    //     if (this.replied) {
    //         if (!this.isSlash) {
    //             var msg = await this.interaction.channel.send(...data);
    //             return msg;
    //         } else {
    //             // if (this.interaction.deferred) return this.interaction.editReply(...reply);
    //             return await this.interaction.channel.send(...data);
    //         }
    //     } else {
    //         return await this.reply(...data);
    //     }
    // }

    async reply(...reply) {
        this.replied = true;
        // if (!this.isSlash) {
        //     var msg = await this.interaction.reply(...reply);
        //     this.replyMessage = msg;
        //     return msg;
        // } else {
            if (this.interaction.replied) return false;
            if (this.interaction.deferred) return this.interaction.editReply(...reply);
            return await this.interaction.reply(...reply);
        // }
    }

    async deleteReply(...option) {
        this.replied = true;
        // if (!this.isSlash) {
        //     // var typing = await this.interaction.channel.sendTyping(...option);
        //     return null;
        // } else {
            if (this.interaction.replied) return false;
            return await this.interaction.deleteReply(...option);
        // }
    }

    async deferReply(...option) {
        this.replied = true;
        // if (!this.isSlash) {
        //     var typing = await this.interaction.channel.sendTyping(...option);
        //     return typing;
        // } else {
            if (this.interaction.replied) return false;
            return await this.interaction.deferReply(...option);
        // }
    }

    // async editReply(...option) {
    //     if (!this.isSlash) {
    //         if (!this.replyMessage) return false;
    //         var edit = await this.replyMessage.edit(...option);
    //         return edit;
    //     } else {
    //         if (!this.interaction.replied) return false;
    //         return await this.interaction.editReply(...option);
    //     }
    // }

    // getFirstOption() {
    //     if (!this.isSlash) {
    //         return this.info.option;
    //     } else {
    //         return this.interaction.options.data.filter(x => x.type == "STRING").length !== 0 ? this.interaction.options.data.filter(x => x.type == "STRING")[0].value : null;
    //     }
    // }

    async exec() {
        // await this.deferReply();
        var language = this.info.language;
        var InternalPermissions = await this.author.getPermissions();
        // console.log(permission);
        
        if (InternalPermissions.has(this.command.permissions.internal)) {
            if (!this.interaction.channel.permissionsFor((await this.interaction.guild.members.fetchMe())).has([BigInt(1 << 10), BigInt(1 << 11), BigInt(1 << 14)])) return await this.interaction.reply({ content: `<#${this.interaction.channel.id}> 内でBotがメッセージを閲覧する権限または(埋め込み)メッセージを送る権限がありません。`, ephemeral: true });
            var botChannelPermission = new ExtendedPermissionsBitField(this.interaction.channel.permissionsFor(await this.interaction.guild.members.fetchMe()).bitfield);
            var botGuildPermission = new ExtendedPermissionsBitField(this.interaction.guild.members.me.permissions.bitfield);
            if (!botGuildPermission.has(this.command.permissions.botNeededInGuild)) {
                console.log(botGuildPermission.missing(this.command.permissions.botNeededInGuild).toString())
                return await this.interaction.reply({ content: botGuildPermission.missing(this.command.permissions.botNeededInGuild).toString(), ephemeral: true });
            }
            //ギルド本体で与えられていてもチャンネルで与えられていない場合の例外処理+親切に教えてあげましょう
            //if (!this.interaction.channel.permissionsFor((await interaction.guild.members.fetchMe())).has(this.command.permissions.botNeeded))
            // ↑↑↑要多言語対応化↑↑↑
            //ユーザー側の権限チェックを追加
            return await this.command.exec(this, this.interaction);
        } else {
            return await this.reply({ content: client.locale.getString("errors.permissions.user.internalPermission", language), ephemeral: true });
        }
    }
}