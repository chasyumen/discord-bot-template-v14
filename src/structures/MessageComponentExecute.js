import { Message } from "discord.js";
import ExtendedPermissionsBitField from "./ExtendedPermissionsBitField.js";

export default class MessageComponentExecute {
    constructor(component, interaction, info) {
        this.component = component;
        this.info = info;
        this.interaction = interaction;
        this.isSlash = info.isSlash;
        this.replyMessage = null;

        this.guild = this.interaction.guild || null;
        this.user = interaction.user;
        this.channel = this.interaction.channel || null;
        this.member = this.interaction.member;
        this.options = this.interaction.options;
        this.replied = false;
    }

    async reply(...reply) {
        return await this.interaction.reply(...reply);
    }

    async deferReply(...option) {
        return await this.interaction.deferReply(...option);
    }

    async update(...option) {
        return await this.interaction.update(...option);
    }

    async deferUpdate(...option) {
        return await this.interaction.deferUpdate(...option);
    }

    async editReply(...option) {
        return await this.interaction.editReply(...option);
    }

    async exec() {
        // await this.deferReply();
        var language = this.info.language;
        var InternalPermissions = await this.user.getPermissions();
        // console.log(permission);
        
        if (InternalPermissions.has(this.component.permissions.internal)) {
            var checkUserPermissions = true; //guildDb.get checkUserPermissions
            // if (!this.interaction.channel.permissionsFor((await this.interaction.guild.members.fetchMe())).has([BigInt(1 << 10), BigInt(1 << 11), BigInt(1 << 14)])) return await this.interaction.reply({ content: client.locale.getString("errors.permissions.bot.minimum", language).replace(/!{channel}/g, `<#${this.interaction.channel.id}>`), ephemeral: true });
            var botChannelPermission = new ExtendedPermissionsBitField(this.interaction.channel.permissionsFor(await this.interaction.guild.members.fetchMe()).bitfield);
            var botGuildPermission = new ExtendedPermissionsBitField(this.interaction.guild.members.me.permissions.bitfield);
            // var requiredChannel = new ExtendedPermissionsBitField(this.command.permissions.botNeededInChannel);
            // var requiredGuild = new ExtendedPermissionsBitField(this.command.permissions.botNeededInGuild);
            // var merged = requiredChannel.add(requiredGuild);
            if (!botGuildPermission.has(this.component.permissions.botNeededInGuild)) {
                var permissions = [];
                botGuildPermission.missing(this.component.permissions.botNeededInGuild).forEach(perm => {
                    permissions.push(client.locale.getString(`permissions.${perm}`, language));
                })
                return await this.interaction.reply({ content: client.locale.getString("errors.permissions.bot.any", language).replace(/!{permissions}/g, permissions.toString()), ephemeral: true });
            }
            if (!botChannelPermission.has(this.component.permissions.botNeededInChannel)) {
                var permissions = [];
                var rawPerm = botGuildPermission.toArray();
                var channelErrorPermissions = [];
                botChannelPermission.missing(this.component.permissions.botNeededInChannel).forEach(perm => {
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
                if (!this.interaction.member.permissions.has(this.component.permissions.userNeeded)) {
                    // console.log("error detect")
                    var permissions = [];
                    this.interaction.member.permissions.missing(this.component.permissions.userNeeded).forEach(perm => {
                        permissions.push(client.locale.getString(`permissions.${perm}`, language));
                    })
                    return await this.interaction.reply({ content: client.locale.getString("errors.permissions.user.any", language).replace(/!{permissions}/g, permissions.toString()), ephemeral: true });
                }
            }
            //TODOユーザー側の権限チェックを追加
            return await this.component.exec(this, this.interaction);
        } else {
            return await this.reply({ content: client.locale.getString("errors.permissions.user.internalPermission", language), ephemeral: true });
        }
    }
}