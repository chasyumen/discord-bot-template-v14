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

    async followUp(...option) {
        return await this.interaction.followUp(...option);
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
            var checkUserPermissions = true; //guildDb.get checkUserPermissions
            // if (!this.interaction.channel.permissionsFor((await this.interaction.guild.members.fetchMe())).has([BigInt(1 << 10), BigInt(1 << 11), BigInt(1 << 14)])) return await this.interaction.reply({ content: client.locale.getString("errors.permissions.bot.minimum", language).replace(/!{channel}/g, `<#${this.interaction.channel.id}>`), ephemeral: true });
            var botChannelPermission = new ExtendedPermissionsBitField(this.interaction.channel.permissionsFor(await this.interaction.guild.members.fetchMe()).bitfield);
            var botGuildPermission = new ExtendedPermissionsBitField(this.interaction.guild.members.me.permissions.bitfield);
            // var requiredChannel = new ExtendedPermissionsBitField(this.command.permissions.botNeededInChannel);
            // var requiredGuild = new ExtendedPermissionsBitField(this.command.permissions.botNeededInGuild);
            // var merged = requiredChannel.add(requiredGuild);
            if (!botGuildPermission.has(this.command.permissions.botNeededInGuild)) {
                var permissions = [];
                botGuildPermission.missing(this.command.permissions.botNeededInGuild).forEach(perm => {
                    permissions.push(client.locale.getString(`permissions.${perm}`, language));
                })
                return await this.interaction.reply({ content: client.locale.getString("errors.permissions.bot.any", language).replace(/!{permissions}/g, permissions.toString()), ephemeral: true });
            }
            if (!botChannelPermission.has(this.command.permissions.botNeededInChannel)) {
                var permissions = [];
                var rawPerm = botGuildPermission.toArray();
                var channelErrorPermissions = [];
                botChannelPermission.missing(this.command.permissions.botNeededInChannel).forEach(perm => {
                    if (rawPerm.includes(perm)) {
                        channelErrorPermissions.push(client.locale.getString(`permissions.${perm}`, language));
                    }
                    permissions.push(client.locale.getString(`permissions.${perm}`, language));
                });
                if (channelErrorPermissions.length == 0) {
                    return await this.interaction.reply({ content: client.locale.getString("errors.permissions.bot.any_channel2", language).replace(/!{permissions}/g, permissions.toString()), ephemeral: true });
                }
                return await this.interaction.reply({ content: client.locale.getString("errors.permissions.bot.any_channel", language).replace(/!{permissions}/g, permissions.toString()).replace(/!{permissions2}/g, channelErrorPermissions.toString()), ephemeral: true });
            }

            if (this.interaction.inGuild() && checkUserPermissions) {
                // console.log("checkuser")
                if (!this.interaction.member.permissions.has(this.command.permissions.userNeeded)) {
                    // console.log("error detect")
                    var permissions = [];
                    this.interaction.member.permissions.missing(this.command.permissions.userNeeded).forEach(perm => {
                        permissions.push(client.locale.getString(`permissions.${perm}`, language));
                    })
                    return await this.interaction.reply({ content: client.locale.getString("errors.permissions.user.any", language).replace(/!{permissions}/g, permissions.toString()), ephemeral: true });
                }
            }
            //TODOユーザー側の権限チェックを追加
            return await this.command.exec(this, this.interaction);
        } else {
            return await this.reply({ content: client.locale.getString("errors.permissions.user.internalPermission", language), ephemeral: true });
        }
    }
}